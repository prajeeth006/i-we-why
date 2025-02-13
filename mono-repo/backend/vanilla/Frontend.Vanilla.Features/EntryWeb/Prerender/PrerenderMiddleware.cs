using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.EntryWeb.Prerender;

internal sealed class PrerenderMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IPrerenderService prerenderService,
    IPrerenderConfiguration config,
    IPrerenderDetector prerenderDetector,
    ILogger<PrerenderMiddleware> log)
    : WebAbstractions.Middleware(next)
{
    public const string QueryKeyDisableToggle = "skipPrerender";
    public const string DiagnosticHeader = "X-Vanilla-Prerendered";
    private readonly ILogger log = log;

    // Tries to avoid async ovearhead if possible b/c executed for each request
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>()
            || !config.Enabled
            || httpContext.Request.Query.ContainsKey(QueryKeyDisableToggle)
            || prerenderDetector.IsRequestFromPrerenderService) // Prevent loop
            return Next(httpContext);

        var currentPageUrl = httpContext.Request.GetFullUrl();
        var userAgent = httpContext.Request.Headers[HttpHeaders.UserAgent].ToString();
        var xForwardedFor = httpContext.Request.Headers[HttpHeaders.XForwardedFor].ToString();
        var correlationHeader = httpContext.Request.Headers[HttpHeaders.XCorrelationId].ToString();
        var correlationId = Guid.TryParse(correlationHeader, out var c) ? c.ToString() : Guid.NewGuid().ToString();

        return !config.ExcludedPagePathAndQueryRegex.IsMatch(currentPageUrl.GetLeftPart(UriPartial.Path))
            ? PrerenderPageAsync()
            : Next(httpContext);

        async Task PrerenderPageAsync()
        {
            try
            {
                var prerenderedPage = await prerenderService.GetPrerenderedPageAsync(currentPageUrl, userAgent, xForwardedFor, correlationId, httpContext.RequestAborted);

                var response = httpContext.Response;
                response.StatusCode = (int)prerenderedPage.StatusCode;
                response.Headers.Add(prerenderedPage.Headers, KeyConflictResolution.Overwrite);
                response.Headers[DiagnosticHeader] = prerenderedPage.Request.Url.AbsoluteUri;
                response.Headers[HttpHeaders.CacheControl] = config.CacheControlResponseHeader;

                await response.Body.WriteAsync(prerenderedPage.Content, httpContext.RequestAborted);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Prerender feature failed with {correlationId}. Regular page will be served if possible", correlationId);
                httpContext.Response.Headers.Append(DiagnosticHeader, "FAILED");
                httpContext.Response.Headers.Append(HttpHeaders.XCorrelationId, correlationId);
                await Next(httpContext);
            }
        }
    }
}
