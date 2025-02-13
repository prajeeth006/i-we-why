using Newtonsoft.Json;

namespace Frontend.Vanilla.Diagnostics.Contracts.Cache;

[method: JsonConstructor]
public sealed class CacheInfoResult(object distributedCache, object memoryCache)
{
    public object DistributedCache { get; } = distributedCache;
    public object MemoryCache { get; } = memoryCache;
}
