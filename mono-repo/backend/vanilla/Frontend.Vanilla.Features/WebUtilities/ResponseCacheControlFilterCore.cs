using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;
using Microsoft.Net.Http.Headers;
using static Microsoft.Net.Http.Headers.CacheControlHeaderValue;

namespace Frontend.Vanilla.Features.WebUtilities;

/// <summary>
/// Custom attribute to add cache control headers configured on Dynacon to the requests.
/// Config should have path (mandatory) and query params (optional).
/// Query Params can contain Wildcard (*).
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class ResponseCacheControlCoreAttribute : ActionFilterAttribute
{
    private const string Wildcard = "*";

    /// <summary>
    /// Called by the ASP.NET MVC framework after the action method executes.
    /// </summary>
    /// <param name="filterContext"></param>
    public override void OnActionExecuted(ActionExecutedContext filterContext)
    {
        var newConfig = new CacheControlHeaderValue();

        var headersConfiguration = (IHeadersConfiguration)filterContext.HttpContext.RequestServices.GetRequiredService(typeof(IHeadersConfiguration));

        var parsedConfig = headersConfiguration.ClientResponseCacheControl.Select(x => new
        {
            Uri = new Uri(new Uri("https://" + filterContext.HttpContext.Request.Host, UriKind.Absolute), x.Key),
            CacheHeaders = x.Value,
        });

        // Filter only configs where request path ends with config path.
        var matches = parsedConfig.Where(x => filterContext.HttpContext.Request.Path.ToString().EndsWithIgnoreCase(x.Uri.AbsolutePath));

        if (!matches.Any())
        {
            return;
        }

        // If there is any config without query params, remove the ones with as it shouldn't matter.
        if (matches.Any(x => string.IsNullOrWhiteSpace(x.Uri.Query)))
        {
            matches = matches.Where(x => string.IsNullOrWhiteSpace(x.Uri.Query));
        }

        // Descending order to make sure Wildcard configs are the last, to override any possible previous matching config.
        matches = matches.OrderByDescending(x => x.Uri.Query);

        var previousQueryMatchCount = 0;

        foreach (var item in matches)
        {
            var itemQueryString = HttpUtility.ParseQueryString(item.Uri.Query);

            var noQueryStrings = itemQueryString.Count == 0;
            var requestQueryString = HttpUtility.ParseQueryString(filterContext.HttpContext.Request.QueryString.Value ?? string.Empty);
            var hasExtraQueryKeys = itemQueryString.AllKeys.Except(requestQueryString.AllKeys).Any();

            var requestQueryCollection = requestQueryString.Cast<string>().Select((s, ix) => new KeyValuePair<string, StringValues>(s, requestQueryString[ix]));
            var hasDifferentQueryValues = !requestQueryCollection.Where(x => itemQueryString[x.Key] != null && itemQueryString[x.Key]?.Equals(Wildcard) is false)
                .All(q => StringComparer.InvariantCultureIgnoreCase.Equals(q.Value, itemQueryString[q.Key]));

            if (noQueryStrings)
            {
                TryParse(item.CacheHeaders, out newConfig);

                continue;
            }

            var queryMatchCount = itemQueryString.AllKeys.Intersect(requestQueryString.AllKeys).Count();

            var bestMatch = (queryMatchCount >= previousQueryMatchCount) && !hasExtraQueryKeys && !hasDifferentQueryValues;

            if (queryMatchCount > previousQueryMatchCount)
            {
                previousQueryMatchCount = queryMatchCount;
            }

            if (!bestMatch)
            {
                continue;
            }

            foreach (var key in itemQueryString.AllKeys)
            {
                if (itemQueryString[key]?.Equals(Wildcard) is true)
                {
                    if (!requestQueryString.AllKeys.Any(x => x?.Equals(key, StringComparison.InvariantCultureIgnoreCase) is true))
                    {
                        continue;
                    }

                    if (itemQueryString.Cast<string>().Any(x => x != key && !StringComparer.InvariantCultureIgnoreCase.Equals(requestQueryString[x], itemQueryString[x])))
                    {
                        break;
                    }
                }
                else if (!StringComparer.InvariantCultureIgnoreCase.Equals(requestQueryString[key], itemQueryString[key]))
                {
                    continue;
                }

                TryParse(item.CacheHeaders, out newConfig);

                if (newConfig == null)
                {
                    // TODO: Get Logger from container and log error.
                    continue;
                }
                else
                {
                    break;
                }
            }
        }

        if (newConfig?.Equals(new CacheControlHeaderValue()) is false)
        {
            filterContext.HttpContext.Response.GetTypedHeaders().CacheControl = newConfig;
            filterContext.HttpContext.Response.Headers.Vary = new[] { HttpHeaders.AcceptEncoding, HttpHeaders.NativeApp };
        }
    }
}
