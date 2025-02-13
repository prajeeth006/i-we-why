using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.GlobalErrorHandling;

internal interface IGlobalErrorHandler
{
    Task<bool> HandleAsync(ExecutionMode mode, Exception exception, HttpContext httpContext);
}

internal sealed class GlobalErrorHandler(IInternalRequestEvaluator internalRequestEvaluator, ILogger<GlobalErrorHandler> log) : IGlobalErrorHandler
{
    public Task<bool> HandleAsync(ExecutionMode mode, Exception exception, HttpContext httpContext)
    {
        var errorId = Guid.NewGuid().ToString(); // So that screenshot from a user can identify the error
        log.LogError(exception, "Unhandled web application error with {errorId}", errorId);

        if (httpContext.Response.HasStarted)
            log.LogWarning(
                "Unable to render custom error page because the response is already in progress. User will receive corrupted response. See original {errorId}", errorId);

        return !httpContext.Response.HasStarted && !internalRequestEvaluator.IsInternal()
            ? RenderPageAsync()
            : DefaultResultTask<bool>.Value;

        async Task<bool> RenderPageAsync()
        {
            try
            {
                httpContext.Response.Clear();
                httpContext.Response.StatusCode = exception is AntiForgeryValidationException ? StatusCodes.Status403Forbidden : StatusCodes.Status500InternalServerError;
                httpContext.Response.ContentType = ContentTypes.Html;

                var html = "<!DOCTYPE html>"
                           + "<html>"
                           + "<head><title>Internal Server Error</title></head>"
                           + "<body>"
                           + "    <h1>Internal Server Error</h1>"
                           + "    <p>Sorry, a technical problem occurred on the page you tried to reach.</p>"
                           + $"    <p>Error ID: {errorId}</p>"
                           + "</body>"
                           + "</html>";

                var bytes = html.EncodeToBytes();
                httpContext.Response.ContentLength = bytes.Length;
                await httpContext.Response.Body.WriteAsync(mode, bytes);
            }
            catch (Exception ex)
            {
                log.LogWarning(ex, "Failed to render custom error page. See original {errorId}", errorId);
            }

            return true;
        }
    }
}
