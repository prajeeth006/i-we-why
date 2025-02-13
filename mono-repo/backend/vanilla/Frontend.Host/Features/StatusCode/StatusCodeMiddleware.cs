using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Host.Features.StatusCode;

internal class StatusCodeMiddleware(
    RequestDelegate next,
    IStatusCodeConfiguration statusCodeConfiguration,
    IEndpointMetadata endpointMetadata)
    : Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!httpContext.Request.Path.HasValue
            || !endpointMetadata.Contains<ServesHtmlDocumentAttribute>()
            || statusCodeConfiguration.ResponseStatusCode.IsNullOrEmpty()) return Next(httpContext);

        foreach (var statusCode in statusCodeConfiguration.ResponseStatusCode.Keys)
        {
            var allPaths = statusCodeConfiguration.ResponseStatusCode[statusCode];

            if (Enumerable.Any(allPaths,
                    path => Regex.IsMatch(httpContext.Request.Path.Value, path, RegexOptions.IgnoreCase)))
            {
                httpContext.Response.StatusCode = Convert.ToInt16(statusCode);
            }
        }

        return Next(httpContext);
    }
}
