using System;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Memory;

namespace Frontend.Vanilla.Core.Caching.Isolation;

/// <summary>
/// Methods for isolating <see cref="IMemoryCache" />.
/// </summary>
internal static class MemoryCacheIsolation
{
    internal const string NullPrefixError = "What's the point of isolation if you don't provide the prefix?";

    /// <summary>
    /// Isolates cache entries by extending their keys with given constant prefix.
    /// </summary>
    public static IMemoryCache IsolateBy(this IMemoryCache cache, object keyPrefix)
    {
        Guard.NotNull(cache, nameof(cache));
        Guard.NotNull(keyPrefix, nameof(keyPrefix), NullPrefixError);

        return cache.IsolateBy(_ => keyPrefix);
    }

    internal static IMemoryCache IsolateBy(this IMemoryCache cache, Func<object, object> getKeyPrefix)
        => new IsolatedMemoryCache(cache, getKeyPrefix);
}

internal sealed class IsolatedMemoryCache(IMemoryCache inner, Func<object, object> getKeyPrefix) : IMemoryCache
{
    public IMemoryCache Inner { get; } = inner;
    public Func<object, object> GetKeyPrefix { get; } = getKeyPrefix;

    private Tuple<object, object> GetFullKey(object key)
    {
        Guard.NotNull(key, nameof(key));

        var prefix = GetKeyPrefix(key) ?? throw new Exception(MemoryCacheIsolation.NullPrefixError);

        return Tuple.Create(prefix, key);
    }

    public bool TryGetValue(object key, out object? value)
        => Inner.TryGetValue(GetFullKey(key), out value);

    public ICacheEntry CreateEntry(object key)
    {
        var entry = Inner.CreateEntry(GetFullKey(key));

        return new CallerKeyedCacheEntry(entry, key);
    }

    public void Remove(object key)
        => Inner.Remove(GetFullKey(key));

    public void Dispose()
        => Inner.Dispose();

    private class CallerKeyedCacheEntry(ICacheEntry inner, object callerProvidedKey) : MemoryCacheEntryDecorator(inner)
    {
        public override object Key { get; } = callerProvidedKey;

        public override void Dispose()
        {
            // Transform callbacks to be called with caller key instead of inner isolated one
            var existingCallbacks = PostEvictionCallbacks.ToArray();
            PostEvictionCallbacks.Clear();
            PostEvictionCallbacks.Add(existingCallbacks.Select(c => new PostEvictionCallbackRegistration
            {
                State = c.State,
                EvictionCallback = (_, v, r, s) => c.EvictionCallback?.Invoke(Key, v, r, s),
            }));

            base.Dispose();
        }
    }
}
