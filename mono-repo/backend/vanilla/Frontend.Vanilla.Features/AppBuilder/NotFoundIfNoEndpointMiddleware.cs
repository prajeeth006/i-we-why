using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Utils;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.AppBuilder;

/// <summary>
/// If there is no associated endpoint (mapped route) then sets HTTP response to not-found and stops further execution
/// which is performant and next middlewares in the pipeline can rely on an endpoint.
/// </summary>
internal sealed class NotFoundIfNoEndpointMiddleware(RequestDelegate next, IInternalRequestEvaluator internalRequestEvaluator) : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (httpContext.GetEndpoint() != null)
            return Next(httpContext);

        httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;

        if (internalRequestEvaluator.IsInternal())
        {
            httpContext.Response.ContentType = ContentTypes.Text;

            return httpContext.Response.WriteAsync(
                "No route registered at this path. See available routes at /health/info/routes.",
                httpContext.RequestAborted);
        }

        return Task.CompletedTask;
    }
}
