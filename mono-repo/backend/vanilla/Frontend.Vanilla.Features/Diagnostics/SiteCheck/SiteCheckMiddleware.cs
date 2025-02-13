using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.SiteCheck;

/// <summary>
/// Returns static CHECK_OK to indicate that website is up and running.
/// This is minimal check, for full operability there is /health.
/// </summary>
internal sealed class SiteCheckMiddleware(RequestDelegate next) : WebAbstractions.Middleware(next)
{
    public const string CheckOk = "CHECK_OK";

    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!httpContext.Request.Path.EqualsIgnoreCase("/site/check"))
            return Next(httpContext);

        return httpContext.WriteResponseAsync(ContentTypes.Text, CheckOk);
    }
}
