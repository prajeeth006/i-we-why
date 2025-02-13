using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.App;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.Core;

/// <summary>
/// Executes <see cref="ICurrentContextSwitchHandler" /> according to HTTP request handling.
/// </summary>
internal sealed class WebAppContextSwitchMiddleware(RequestDelegate next, IEnumerable<ICurrentContextSwitchHandler> switchHandlers, IAppConfiguration appConfiguration)
    : WebAbstractions.Middleware(next)
{
    private readonly IReadOnlyList<ICurrentContextSwitchHandler> switchHandlers = switchHandlers.ToArray();

    public override async Task InvokeAsync(HttpContext httpContext)
    {
        if (appConfiguration.UseSwitchMiddleware)
        {
            var ct = httpContext.RequestAborted;
            await Task.WhenAll(switchHandlers.ConvertAll(h => h.OnContextBeginAsync(ct)));
            await Next.Invoke(httpContext);
            await Task.WhenAll(switchHandlers.ConvertAll(h => h.OnContextEndAsync(ct)));
        }
        else
        {
            await Next.Invoke(httpContext);
        }
    }
}
