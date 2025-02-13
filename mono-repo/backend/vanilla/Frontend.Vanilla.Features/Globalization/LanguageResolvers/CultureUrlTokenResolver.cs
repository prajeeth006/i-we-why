using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

internal interface ICultureUrlTokenResolver
{
    (string? Token, CultureUrlTokenSource? Source) GetToken(HttpContext httpContext);
    HttpUri GetUrlWithCultureToken(HttpContext httpContext, TrimmedRequiredString cultureToken);
    bool IsValidCultureUrlToken(string? culture);
}

internal enum CultureUrlTokenSource
{
    UrlQuery,
    RouteValues,
}

internal sealed class CultureUrlTokenResolver(IGlobalizationConfiguration config, IInternalLanguagesResolver internalLanguagesResolver)
    : ICultureUrlTokenResolver
{
    public (string? Token, CultureUrlTokenSource? Source) GetToken(HttpContext httpContext)
    {
        var queryParam = httpContext.Request.Query[RouteValueKeys.Culture].ToString();

        if (!queryParam.IsNullOrWhiteSpace() && IsValidCultureUrlToken(queryParam))
            return (queryParam, CultureUrlTokenSource.UrlQuery);

        if (httpContext.Request.RouteValues.TryGetString(RouteValueKeys.Culture, "route value", out var routeValue) && IsValidCultureUrlToken(routeValue))
            return (routeValue, CultureUrlTokenSource.RouteValues);

        return default;
    }

    public HttpUri GetUrlWithCultureToken(HttpContext httpContext, TrimmedRequiredString cultureToken)
    {
        var (oldToken, tokenSource) = GetToken(httpContext);
        var builder = new UriBuilder(httpContext.Request.GetFullUrl());

        switch (tokenSource)
        {
            case CultureUrlTokenSource.RouteValues:
                builder.Path = $"{builder.Path}/".Replace($"/{oldToken}/", $"/{cultureToken}/").TrimEnd('/');

                break;
            case CultureUrlTokenSource.UrlQuery:
                builder.RemoveQueryParameters(RouteValueKeys.Culture)
                    .AddQueryParameters((RouteValueKeys.Culture, cultureToken));

                break;
            default:
                throw new Exception("Given HttpContext doesn't contain culture in the URL.");
        }

        return builder.GetHttpUri();
    }

    public bool IsValidCultureUrlToken(string? culture)
    {
        return IsContainedIn(config.AllowedLanguages) // Contains hidden -> some will be redirected by LanguageRedirectRouteHandler
               || IsContainedIn(config.OfflineLanguages) // Will be redirected by LanguageRedirectRouteHandler
               || IsContainedIn(internalLanguagesResolver.Resolve()); // Get according to context, then there will be no redirect

        bool IsContainedIn(IEnumerable<LanguageInfo> langs)
        {
            return langs.Any(l => l.RouteValue.EqualsIgnoreCase(culture));
        }
    }
}
