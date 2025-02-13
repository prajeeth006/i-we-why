using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebAbstractions;

/// <summary>
/// Base class for middlewares.
/// </summary>
public abstract class Middleware
{
    /// <summary>
    /// Next delegate.
    /// </summary>
    public RequestDelegate Next { get; }

    /// <summary>
    /// Create new instance.
    /// </summary>
    /// <param name="next"></param>
    protected Middleware(RequestDelegate next)
        => Next = next;

    /// <summary>
    /// Method to invoke.
    /// </summary>
    /// <param name="context"></param>
    /// <returns></returns>
    public abstract Task InvokeAsync(HttpContext context);
}

/// <summary>
/// Convenient way to execute code before calling Next.
/// </summary>
internal abstract class BeforeNextMiddleware(RequestDelegate next) : Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        BeforeNext(httpContext);

        return Next(httpContext);
    }

    public abstract void BeforeNext(HttpContext httpContext);
}
