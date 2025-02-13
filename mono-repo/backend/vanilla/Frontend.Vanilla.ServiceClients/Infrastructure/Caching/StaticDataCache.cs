#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Stores <see cref="PosApiDataType.Static" /> data in <see cref="IMemoryCache" /> and <see cref="IDistributedCache" />.
/// Stores data in IMemoryCache and IDistributedCache to decrease number of requests to PosApi. When a server caches some information in local memory, it also caches it in distributed cache.
/// Then another server that don't have a local copy in memory can re-use data from distributed cache, and don't have to send request to PosApi.
/// </summary>
internal interface IStaticDataCache
{
    Task<object?> GetAsync(ExecutionMode mode, RequiredString key, Type resultType);
    Task SetAsync(ExecutionMode mode, RequiredString key, object value, TimeSpan relativeExpiration);
    Task RemoveAsync(ExecutionMode mode, RequiredString key);
}

internal sealed class StaticDataCache(ILabelIsolatedMemoryCache memoryCache, ILabelIsolatedDistributedCache distributedCache, IClock clock)
    : IStaticDataCache
{
    private readonly IMemoryCache memoryCache = memoryCache;
    private readonly IDistributedCache distributedCache = distributedCache;

    public async Task<object?> GetAsync(ExecutionMode mode, RequiredString key, Type resultType)
    {
        var cacheKey = GetFullCacheKey(key);
        var result = memoryCache.Get(cacheKey);

        if (result != null)
            return result;

        var jsonStr = await distributedCache.GetStringAsync(mode, cacheKey);

        if (jsonStr == null)
            return null;

        var distributedCacheEntry = JsonConvert.DeserializeObject<DistributedStaticDataEntry>(jsonStr) ?? throw new NullDeserializedException();

        if (distributedCacheEntry.AbsoluteExpiration < clock.UtcNow)
            return null;

        result = distributedCacheEntry.CachedValue.ToObject(resultType) ?? throw new NullDeserializedException();
        SetToMemoryCache(cacheKey, result, distributedCacheEntry.AbsoluteExpiration);

        return result;
    }

    public Task SetAsync(ExecutionMode mode, RequiredString key, object value, TimeSpan relativeExpiration)
    {
        var cacheKey = GetFullCacheKey(key);
        var absoluteExpiration = clock.UtcNow + relativeExpiration;

        SetToMemoryCache(cacheKey, value, absoluteExpiration);

        var jsonStr = JsonConvert.SerializeObject(new DistributedStaticDataEntry(JToken.FromObject(value), absoluteExpiration));
        var distributedOptions = new DistributedCacheEntryOptions().SetAbsoluteExpiration(relativeExpiration);

        return distributedCache.SetStringAsync(mode, cacheKey, jsonStr, distributedOptions);
    }

    private void SetToMemoryCache(string cacheKey, object value, UtcDateTime absoluteExpiration)
    {
        // Randomizes cache time to solve concurrency across servers of web farm -> most likely just first one will make actual request to PosApi
        var offset = TimeSpan.FromSeconds(RandomGenerator.GetDouble() * 10);
        memoryCache.Set(cacheKey, value, absoluteExpiration + offset);
    }

    public Task RemoveAsync(ExecutionMode mode, RequiredString key)
    {
        var cacheKey = GetFullCacheKey(key);
        memoryCache.Remove(cacheKey);

        return distributedCache.RemoveAsync(mode, cacheKey);
    }

    // DON'T CHANGE B/C DISTRIBUTED CACHED -> IT WILL BREAK COMPATIBILITY BETWEEN APPS WITH DIFFERENT VANILLA ON THE SAME LABEL!!!
    private string GetFullCacheKey(string key)
        => $"Van:PosApi:{PosApiDataType.Static}Data:{key}";

    private sealed class DistributedStaticDataEntry(JToken cachedValue, UtcDateTime absoluteExpiration)
    {
        public JToken CachedValue { get; } = Guard.NotNull(cachedValue, nameof(cachedValue));
        public UtcDateTime AbsoluteExpiration { get; } = absoluteExpiration; // Needed to copy it from distributed to memory cache
    }
}
