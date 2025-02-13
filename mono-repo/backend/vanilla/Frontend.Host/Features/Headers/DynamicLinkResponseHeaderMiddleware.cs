using Frontend.Host.Features.Assets;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using EnumerableExtensions = Frontend.Vanilla.Core.Collections.EnumerableExtensions;

namespace Frontend.Host.Features.Headers;

internal class DynamicLinkResponseHeaderMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IHeadersConfiguration headersConfiguration,
    IBootstrapAssetsContext bootstrapAssetsContext,
    ILogger<DynamicLinkResponseHeaderMiddleware> log)
    : Middleware(next)
{
    private const string LinkHeaderName = "Link";

    public override Task InvokeAsync(HttpContext httpContext)
    {
        return !endpointMetadata.Contains<ServesHtmlDocumentAttribute>() ||
               !headersConfiguration.DynamicEarlyHintsFromManifest.Any()
            ? Next(httpContext)
            : AddLinkHeaderAsync();

        async Task AddLinkHeaderAsync()
        {
            try
            {
                var manifestFiles = await bootstrapAssetsContext.GetWebpackManifestFileEntriesAsync(httpContext.RequestAborted);
                var linkResponseHeaderValue = EnumerableExtensions.Join(Enumerable.Where(Enumerable.Select(headersConfiguration.DynamicEarlyHintsFromManifest,
                    earlyHint =>
                    {
                        var fileHref = manifestFiles?.GetValue(earlyHint.Key);

                        if (fileHref == null)
                            return null;

                        var attributes = EnumerableExtensions.Join(Enumerable.Select(earlyHint.Value, attribute => $"{attribute.Key}={attribute.Value}"), "; ");

                        return $"<{fileHref}>; {attributes}";
                    }), linkHeader => linkHeader != null));

                if (!string.IsNullOrEmpty(linkResponseHeaderValue))
                {
                    if (httpContext.Response.Headers.ContainsKey(LinkHeaderName))
                    {
                        var oldValue = httpContext.Response.Headers.GetValue(HttpHeaders.Link);
                        httpContext.Response.Headers[LinkHeaderName] =
                            string.Join(", ", oldValue, linkResponseHeaderValue);
                    }
                    else
                    {
                        httpContext.Response.Headers.Append(LinkHeaderName, linkResponseHeaderValue);
                    }
                }
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Dynamic link response header middleware failed");
            }

            await Next(httpContext);
        }
    }
}
