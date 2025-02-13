using System;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Core.Caching;

/// <summary>
/// Extensions for <see cref="IMemoryCache" />.
/// </summary>
internal static class MemoryCacheExtensions
{
    public static TValue GetOrCreate<TValue>(this IMemoryCache cache, object key, object factoryLock, Func<ICacheEntry, TValue> factory)
    {
        if (!cache.TryGetValue<TValue>(key, out var value))
            lock (factoryLock) // Double-checked locking
                value = cache.GetOrCreate(key, factory);

        return value!;
    }

    public static TValue Set<TValue>(this IMemoryCache cache, object key, TValue value, UtcDateTime absoluteExpiration)
        => cache.Set(key, value, absoluteExpiration.Value);
}
