using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;

/// <summary>
/// Clears memory cache.
/// </summary>
internal sealed class ClearMemoryCacheDiagnosticController(IEnvironmentProvider environmentProvider, MemoryCache memoryCache) : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.ClearMemoryCacheUrl;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        if (environmentProvider.IsProduction)
        {
            httpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;

            return new MessageDto("MemoryCache can't be cleared on PROD because it would have huge performance impact. Restart the website if really necessary.");
        }

        memoryCache.Compact(100);
        const string successMessage = "MemoryCache was successfully cleared.";

        var returnUrl = httpContext.Request.Query["returnUrl"].ToString();

        if (!returnUrl.IsNullOrWhiteSpace())
        {
            await httpContext.WriteResponseAsync(ContentTypes.Html, $"""
                                                                     <!DOCTYPE html><html>
                                                                     <head><meta http-equiv="refresh" content="2;url={returnUrl}" /></head>
                                                                     <body>
                                                                     <p>{successMessage}</p>
                                                                     </body>
                                                                     </html>
                                                                     """);

            return null;
        }

        return new MessageDto(successMessage);
    }
}
