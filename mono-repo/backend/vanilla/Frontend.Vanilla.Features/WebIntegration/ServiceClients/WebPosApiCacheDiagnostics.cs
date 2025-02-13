using System.Collections.Generic;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration.ServiceClients;

/// <summary>
/// Adds more info about HTTP request to <see cref="IPosApiCacheDiagnostics" />.
/// </summary>
internal sealed class WebPosApiCacheDiagnostics(IPosApiCacheDiagnostics inner, IHttpContextAccessor httpContextAccessor) : IPosApiCacheDiagnostics
{
    public IDictionary<string, object?> GetInfo()
    {
        var info = inner.GetInfo();
        var httpContext = httpContextAccessor.GetRequiredHttpContext();

        info["Url"] = httpContext.Request.GetFullUrl();

        return info;
    }
}
