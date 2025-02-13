using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal sealed class CachedDeviceAtlasService : IDeviceAtlasService
{
    private readonly IDeviceAtlasService inner;
    private readonly IMemoryCache memoryCache;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly IDeviceAtlasHeadersFilter deviceAtlasHeadersFilter;
    private static readonly TimeSpan CacheSlidingExpiration = TimeSpan.FromMinutes(20);

    public CachedDeviceAtlasService(IDeviceAtlasService inner, IMemoryCache memoryCache, IHttpContextAccessor httpContextAccessor, IDeviceAtlasHeadersFilter deviceAtlasHeadersFilter)
    {
        this.inner = inner;
        this.memoryCache = memoryCache;
        this.httpContextAccessor = httpContextAccessor;
        this.deviceAtlasHeadersFilter = deviceAtlasHeadersFilter;
    }
    public Task<(bool, IReadOnlyDictionary<string, string>)> GetAsync(ExecutionMode mode)
    {
        var context = httpContextAccessor.GetRequiredHttpContext();
        context.Request.Cookies.TryGetValue(DeviceCapabilitiesDiagnosticProvider.CookieName, out var daprops);

        var cacheKey = GenerateCacheKey(deviceAtlasHeadersFilter.Filter(context.Request.Headers), daprops);

        return memoryCache.GetOrCreateAsync(cacheKey, entry =>
        {
            entry.SlidingExpiration = CacheSlidingExpiration;
            return inner.GetAsync(mode);
        });
    }

    public (bool, IReadOnlyDictionary<string, string>) Get()
    {
        var context = httpContextAccessor.GetRequiredHttpContext();
        context.Request.Cookies.TryGetValue(DeviceCapabilitiesDiagnosticProvider.CookieName, out var daprops);

        var cacheKey = GenerateCacheKey(deviceAtlasHeadersFilter.Filter(context.Request.Headers), daprops);

        return memoryCache.GetOrCreate(cacheKey, entry =>
        {
            entry.SlidingExpiration = CacheSlidingExpiration;
            return inner.Get();
        });
    }

    // todo maybe write this method with spans
    private static string GenerateCacheKey(IEnumerable<KeyValuePair<string, StringValues>> headers, string? dapropsCookie)
    {
        var cacheKeyBuilder = new StringBuilder();

        foreach (var header in headers)
        {
            cacheKeyBuilder.Append(header.Key);
            foreach (var value in header.Value)
            {
                cacheKeyBuilder.Append(value);
            }
        }

        if (dapropsCookie != null)
            cacheKeyBuilder.Append(dapropsCookie);

        var rawKey = cacheKeyBuilder.ToString();
        var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(rawKey));
        return Convert.ToBase64String(hashBytes);
    }
}
