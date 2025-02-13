using System.Threading.Tasks;
using Frontend.Vanilla.Features.Diagnostics.SiteVersion;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics;

/// <summary>
/// Adds diagnostics response header.
/// </summary>
internal sealed class DiagnosticsResponseHeaderMiddleware(RequestDelegate next, IDiagnosticsComponentProvider diagnosticsComponentProvider) : WebAbstractions.Middleware(next)
{
    private const string DiagnosticsResponseHeaderName = "x-bwin-api";
    public override Task InvokeAsync(HttpContext httpContext)
    {
        httpContext.Response.Headers.Append(DiagnosticsResponseHeaderName, diagnosticsComponentProvider.Name);
        return Next(httpContext);
    }
}
