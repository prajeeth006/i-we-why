namespace GantryTradingConnector.Midddleware;

/// <summary>
/// Base class for middlewares.
/// </summary>
internal abstract class Middleware
{
    public RequestDelegate Next { get; }

    protected Middleware(RequestDelegate next)
        => Next = next;

    public abstract Task InvokeAsync(HttpContext context);
}