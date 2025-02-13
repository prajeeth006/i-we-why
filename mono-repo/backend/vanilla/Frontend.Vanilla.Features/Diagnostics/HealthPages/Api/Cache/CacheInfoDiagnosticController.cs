using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Cache;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.Cache;

internal sealed class CacheInfoDiagnosticController(IDistributedCache distributedCache, MemoryCache memoryCache) : IDiagnosticApiController
{
    public DiagnosticsRoute GetRoute() => DiagnosticApiUrls.Cache.Info.Url;

    public Task<object?> ExecuteAsync(HttpContext httpContext)
    {
        var info = new CacheInfoResult(
            new
            {
                Type = distributedCache.GetType().ToString(),
            },
            new { memoryCache.Count });

        return Task.FromResult<object?>(info);
    }
}
