using System;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.WebUtilities;

namespace Frontend.Vanilla.Features.DslProviders;

internal interface IRequestDslRedirector
{
    void Redirect(string url, bool permanentRedirect, bool preserveQuery);
}

internal sealed class RequestDslRedirector(IBrowserUrlProvider browserUrlProvider) : IRequestDslRedirector
{
    public void Redirect(string url, bool permanentRedirect, bool preserveQuery)
    {
        var targetUrl = ParseTargetUrl(url);

        if (preserveQuery)
        {
            var currentQueryString = QueryUtil.Parse(browserUrlProvider.Url.Query);
            var targetQueryString = QueryUtil.Parse(targetUrl.Query);
            var builder = new UriBuilder(targetUrl);

            targetQueryString.Add(currentQueryString, KeyConflictResolution.Skip);
            builder.Query = QueryUtil.Build(targetQueryString);
            targetUrl = builder.GetHttpUri();
        }

        browserUrlProvider.EnqueueRedirect(targetUrl, permanentRedirect);
    }

    private HttpUri ParseTargetUrl(string urlString)
    {
        if (!string.IsNullOrWhiteSpace(urlString))
        {
            if (HttpUri.TryCreate(urlString, out var httpUrl))
                return httpUrl;

            if (Uri.TryCreate(urlString, UriKind.Relative, out var relativeUrl))
                return new HttpUri(new Uri(browserUrlProvider.Url, relativeUrl));
        }

        throw new Exception($"Specified URL '{urlString}' isn't a valid absolute http(s) or relative URL.");
    }
}
