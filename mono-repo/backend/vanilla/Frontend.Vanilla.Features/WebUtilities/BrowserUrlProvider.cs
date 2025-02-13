using System;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.App;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.WebUtilities;

/// <summary>
/// Resolves URL that users sees in browser address bar.
/// For SPAs, it has to be passed from client. For older apps, it equals to request URL.
/// URL can be marked to be redirected. This is usually done by DSL actions. Then some common logic should pick it up and execute.
/// </summary>
internal interface IBrowserUrlProvider
{
    HttpUri Url { get; }
    BrowserUrlRedirect? PendingRedirect { get; }
    void EnqueueRedirect(HttpUri url, bool permanent = false);
}

internal sealed class BrowserUrlRedirect(HttpUri url, bool permanent)
{
    public HttpUri Url { get; } = url;
    public bool Permanent { get; } = permanent;
}

internal sealed class BrowserUrlProvider(IHttpContextAccessor httpContextAccessor, IAppConfiguration appConfig, ILogger<BrowserUrlProvider> log)
    : IBrowserUrlProvider
{
    public const string QueryParameter = "browserUrl";

    public HttpUri Url => State.Url;
    public BrowserUrlRedirect? PendingRedirect => State.PendingRedirect;

    public void EnqueueRedirect(HttpUri url, bool permanent)
        => State.EnqueueRedirect(url, permanent);

    private UrlState State
    {
        get
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();

            return httpContext.GetOrAddScopedValue("Van:BrowserUrl", _ => ResolveFresh(httpContext));
        }
    }

    private UrlState ResolveFresh(HttpContext httpContext)
        => TryParse(httpContext.Request.Query[QueryParameter]!,
               readOnly: !httpContext.Request.Path.EqualsIgnoreCase("/" + DiagnosticApiUrls.Dsl.ExpressionTest.UrlTemplate))
           ?? TryParse(httpContext.Request.Headers[HttpHeaders.XBrowserUrl]!, readOnly: true)
           ?? new UrlState(FixSchemeForSslOffloading(httpContext.Request.GetFullUrl()));

    private UrlState? TryParse(string urlString, bool readOnly)
    {
        if (urlString.IsNullOrWhiteSpace())
            return null;

        if (HttpUri.TryCreate(urlString, out var url))
            return readOnly ? new ReadOnlyUrlState(url) : new UrlState(url);

        log.LogWarning("Invalid browser URL query parameter or header {value}", urlString);

        return null;
    }

    private HttpUri FixSchemeForSslOffloading(HttpUri url)
        => appConfig.UsesHttps ? url.ToHttps() : url; // Don't enforce http if actual request is https

    private class UrlState(HttpUri originalUrl)
    {
        public BrowserUrlRedirect? PendingRedirect { get; private set; }

        public HttpUri Url
            => PendingRedirect?.Url ?? originalUrl;

        public virtual void EnqueueRedirect(HttpUri url, bool permanent)
        {
            if (url == originalUrl)
            {
                PendingRedirect = null;

                return;
            }

            permanent &= PendingRedirect?.Permanent ?? true; // Any temporary -> final is temporary
            PendingRedirect = new BrowserUrlRedirect(url, permanent);
        }
    }

    private sealed class ReadOnlyUrlState(HttpUri url) : UrlState(url)
    {
        public override void EnqueueRedirect(HttpUri url, bool permanent)
            => throw new Exception("URL can't be modified (redirected) because this isn't a document request.");
    }
}
