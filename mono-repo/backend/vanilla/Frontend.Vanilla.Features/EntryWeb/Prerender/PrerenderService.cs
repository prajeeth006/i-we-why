using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.App;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

/// <summary>
///     Represents Prerender.io web service usually hosted at <see href="https://service.prerender.io/" />.
/// </summary>
internal interface IPrerenderService
{
    Task<RestResponse> GetPrerenderedPageAsync(HttpUri pageUrl, string? userAgent, string? xForwardedFor, string correlationId, CancellationToken cancellationToken);
}

internal sealed class PrerenderService(
    IRestClient restClient,
    IPrerenderConfiguration prerenderConfig,
    IAppConfiguration appConfig)
    : IPrerenderService
{
    public const string TokenHeader = "X-Prerender-Token";

    public async Task<RestResponse> GetPrerenderedPageAsync(
        HttpUri pageUrl,
        string? userAgent,
        string? xForwardedFor,
        string correlationId,
        CancellationToken cancellationToken)
    {
        // If SSL offloading with load balancer -> change to https
        var pageUrlInBrowser = appConfig.UsesHttps && pageUrl.Scheme != Uri.UriSchemeHttps
            ? Uri.UriSchemeHttps + pageUrl.AbsoluteUri.Substring(pageUrl.Scheme.Length)
            : pageUrl.AbsoluteUri;

        // Inspired by https://github.com/greengerong/Prerender_asp_mvc/blob/master/Prerender.io/PrerenderModule.cs
        var request = new RestRequest(new HttpUri(prerenderConfig.ServiceUrl.AbsoluteUri + pageUrlInBrowser))
        {
            Headers =
            {
                { TokenHeader, prerenderConfig.Token },
                { HttpHeaders.UserAgent, userAgent },
                { HttpHeaders.CacheControl, "no-cache" },
                { HttpHeaders.Accept, ContentTypes.HtmlWithUtf8 },
                { HttpHeaders.XForwardedFor, xForwardedFor },
                { HttpHeaders.XCorrelationId, correlationId },
            },
            Timeout = prerenderConfig.RequestTimeout,
            FollowRedirects = false, // Redirect is actual response
        };

        try
        {
            return await restClient.ExecuteAsync(request, cancellationToken);
        }
        catch (Exception ex)
        {
            var msg = $"Failed request to Prerender service: {request}"
                      + $" Investigate the configuration '{PrerenderConfiguration.FeatureName}',"
                      + " connection from Vanilla servers to Prerender.io service,"
                      + " connection from Prerender.io service to Vanilla servers so they can prerender pages"
                      + $" (may require Vanilla servers to be on public internet if public Prerender.io is used, usually fails with {nameof(TimeoutException)})"
                      + " and then the service itself."
                      + " Therefore enabling this feature for non-public website (e.g. beta environment) with public Prerender.io service obviously doesn't make sense.";

            throw new Exception(msg, ex);
        }
    }
}
