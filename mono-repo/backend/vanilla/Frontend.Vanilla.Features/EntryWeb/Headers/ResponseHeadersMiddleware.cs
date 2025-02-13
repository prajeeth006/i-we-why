using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.EntryWeb.Headers;

internal class ResponseHeadersMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    IHeadersConfiguration headersConfiguration,
    ILogger<ResponseHeadersMiddleware> log)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        return headersConfiguration.Response.Any() ? AddHeadersAsync() : Next(httpContext);

        async Task AddHeadersAsync()
        {
            foreach (var responseHeader in headersConfiguration.Response)
            {
                if (responseHeader.Value.EnabledOnlyForDocumentRequest && !endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
                {
                    continue;
                }

                try
                {
                    if (await responseHeader.Value.Enabled.EvaluateAsync(httpContext.RequestAborted))
                    {
                        httpContext.Response.Headers[responseHeader.Key] = responseHeader.Value.Value;
                    }
                }
                catch (Exception ex)
                {
                    log.LogError(ex,
                        "Response headers middleware failed for header with {name}, {value}, {dsl}",
                        responseHeader.Key,
                        responseHeader.Value.Value,
                        responseHeader.Value.Enabled);
                }
            }

            await Next(httpContext);
        }
    }
}
