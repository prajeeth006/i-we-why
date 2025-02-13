using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics.SiteVersion;

internal sealed class SiteVersionMiddleware(RequestDelegate next, VanillaVersion vanillaVersion, IDiagnosticsComponentProvider diagnosticsComponentProvider) : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!httpContext.Request.Path.EqualsIgnoreCase("/site/version"))
            return Next(httpContext);

        return httpContext.WriteResponseAsync(ContentTypes.Text, $"{diagnosticsComponentProvider.Name} {vanillaVersion}");
    }
}
