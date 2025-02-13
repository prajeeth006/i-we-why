using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;

namespace Frontend.TestWeb;

internal sealed class SampleMiddleware(RequestDelegate next, int order) : Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        httpContext.Response.Headers["x-testweb-middleware-" + order] = DateTime.UtcNow.Ticks.ToString();

        return Next(httpContext);
    }
}
