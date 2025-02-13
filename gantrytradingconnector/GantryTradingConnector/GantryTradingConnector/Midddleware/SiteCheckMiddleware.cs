using System.Text;

namespace GantryTradingConnector.Midddleware;

/// <summary>
/// Returns static CHECK_OK to indicate that website is up and running.
/// This is minimal check, for full operability there is /health.
/// </summary>
internal sealed class SiteCheckMiddleware : Middleware
{
    public const string CheckOk = "CHECK_OK";

    public SiteCheckMiddleware(RequestDelegate next)
        : base(next)
    {
    }

    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!httpContext.Request.Path.Equals("/site/check"))
            return Next(httpContext);
        
        return WriteResponseAsync(httpContext, "text/plain", CheckOk);
    }

    public async Task WriteResponseAsync(HttpContext httpContext, string contentType, string text)
    {
        var bytes = Encoding.UTF8.GetBytes(text);
        httpContext.Response.ContentType = contentType;
        httpContext.Response.ContentLength = bytes.Length;
        await httpContext.Response.Body.WriteAsync(bytes, httpContext.RequestAborted);
    }
}
