using System.Text;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Cache;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Cache;

internal sealed class CacheViewDiagnosticController(IDistributedCache cache) : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Cache.View.Url;

    public async Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var key = httpContext.Request.Query.GetRequired(DiagnosticApiUrls.Cache.View.KeyParameter);
        var bytes = await cache.GetAsync(key, httpContext.RequestAborted);

        return new CacheViewResult(bytes is null ? null : Encoding.UTF8.GetString(bytes));
    }
}
