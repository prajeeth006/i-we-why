using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.Content;

/// <summary>
/// Implementation of <see cref="ISmartUrlReplacementResolver" /> for web applications.
/// </summary>
internal class SmartUrlReplacementResolver(IHttpContextAccessor httpContextAccessor, IAppDslProvider appDslProvider)
    : ISmartUrlReplacementResolver
{
    public IEnumerable<string> Resolve()
    {
        var request = httpContextAccessor.HttpContext?.Request;
        if (request is null)
        {
            return Enumerable.Empty<string>();
        }

        var smartUrls = request.Headers
            .Where(x => x.Key.StartsWith("x-smart-url-", StringComparison.OrdinalIgnoreCase))
            .Select(y => GetSmartUrl(y.Key.Split('-').Last(), y.Value.ToString()))
            .ToList();

        return smartUrls.Count == 0 ? GetDefaultSmartUrl(request) : smartUrls;
    }

    private List<string> GetDefaultSmartUrl(HttpRequest request)
    {
        var smartUrlOverride = appDslProvider.Product != null ? GetSmartUrl(appDslProvider.Product, request.Host.ToString()) : string.Empty;
        return new List<string> { smartUrlOverride };
    }

    private static string GetSmartUrl(string smartKey, string smartHostWithoutProtocol)
    {
        return Uri.EscapeDataString($"{smartKey}|{new HttpUri("https://" + smartHostWithoutProtocol)}");
    }
}
