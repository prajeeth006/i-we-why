using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace Frontend.Host.Features.Redirex;

internal sealed class RedirexMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IRedirexService redirexService,
    IRedirexConfiguration config,
    ILogger<RedirexMiddleware> log)
    : Middleware(next)
{
    private const string DiagnosticHeader = "X-Vanilla-Redirex";

    public override async Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>()
            || !config.Enabled
            || redirexService.ShouldSkip(httpContext))
        {
            await Next(httpContext);

            return;
        }

        var requestData = new RedirexRequestData
        {
            Url = httpContext.Request.GetFullUrl().OriginalString,
            IPAddress = httpContext.Request.Headers[HttpHeaders.XForwardedFor].Count > 0
                ? httpContext.Request.Headers[HttpHeaders.XForwardedFor].ToString().Split(',')[0]
                : httpContext.Connection.RemoteIpAddress!.ToString(),
            UserAgent = httpContext.Request.Headers[HttpHeaders.UserAgent].ToString(),
            IgnoreGlobalHttpsRedirect = config.IgnoreGlobalHttpsRedirect,
            ForceUsageOfDisabledRepository = config.ForceUsageOfDisabledRepository,
            SSLOffloadingMode = config.SslOffloadingMode,
            HttpHeaders = new List<KeyValuePair<string, StringValues>>(httpContext.Request.Headers),
        };

        try
        {
            var redirexResponseData = await redirexService.PostAsync(requestData, httpContext.RequestAborted);

            if (redirexResponseData is not { IsRedirect: true })
            {
                await Next(httpContext);

                return;
            }

            var response = httpContext.Response;
            response.StatusCode = redirexResponseData.IsTemporary
                ? StatusCodes.Status302Found
                : StatusCodes.Status301MovedPermanently;

            var normalizedHeaders = redirexResponseData.HttpHeaders.ToDictionary(x => x.Key, x => new StringValues(x.Value));
            DictionaryExtensions.Add(response.Headers, normalizedHeaders, KeyConflictResolution.Overwrite);
            response.Headers[HttpHeaders.Location] = redirexResponseData.Url;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed processing redirex request");
            httpContext.Response.Headers.Append(DiagnosticHeader, "FAILED");
            await Next(httpContext);
        }
    }
}
