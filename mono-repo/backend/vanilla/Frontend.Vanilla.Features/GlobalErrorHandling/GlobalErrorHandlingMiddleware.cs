using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.GlobalErrorHandling;

internal sealed class GlobalErrorHandlingMiddleware(RequestDelegate next, IGlobalErrorHandler errorHandler) : WebAbstractions.Middleware(next)
{
    public override async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await Next(httpContext);
        }
        catch (Exception ex)
        {
            var mode = ExecutionMode.Async(httpContext.RequestAborted);
            var handled = await errorHandler.HandleAsync(mode, ex, httpContext);

            if (!handled) throw;
        }
    }
}
