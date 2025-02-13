using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.ServerTiming;

/// <summary>
/// Outputs total duration of the app itself.
/// Useful to compare from client-side how much overhead is added by web server, CDN, network etc.
/// </summary>
internal sealed class ServerTimingMiddleware(RequestDelegate next, IClock clock) : WebAbstractions.Middleware(next)
{
    public override async Task InvokeAsync(HttpContext httpContext)
    {
        var getElapsed = clock.StartNewStopwatch();

        httpContext.Response.OnStarting(state =>
        {
            var context = (HttpContext)state;
            var elapsed = getElapsed();
            var durationStr = elapsed.TotalMilliseconds.ToInvariantString();
            context.Response.Headers.Append(HttpHeaders.ServerTiming, "vanilla;dur=" + durationStr);

            return Task.CompletedTask;
        }, httpContext);

        await Next(httpContext);
    }
}
