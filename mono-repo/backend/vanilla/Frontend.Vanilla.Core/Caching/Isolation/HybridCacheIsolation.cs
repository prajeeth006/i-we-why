using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Hybrid;

namespace Frontend.Vanilla.Core.Caching.Isolation;

/// <summary>
/// Methods for isolating <see cref="HybridCache" />.
/// </summary>
public static class HybridCacheIsolation
{
    /// <summary>
    /// Isolates cache entries by prepending their keys with given constant prefix.
    /// </summary>
    public static HybridCache IsolateBy(this HybridCache cache, string keyPrefix)
    {
        Guard.NotNull(cache, nameof(cache));
        Guard.NotWhiteSpace(keyPrefix, nameof(keyPrefix));

        return cache.IsolateBy(_ => keyPrefix);
    }

    /// <summary>
    /// Isolates cache entries by prepending their keys with factory function.
    /// </summary>
    public static HybridCache IsolateBy(this HybridCache cache, Func<string, string> getIsolationPrefix)
        => new IsolatedHybridCache(cache, getIsolationPrefix);
}

/// <summary>
/// An instance of <see cref="HybridCache" /> with ability to isolate entries using key prefixes.
/// </summary>
public class IsolatedHybridCache(HybridCache inner, Func<string, string> getKeyPrefix) : HybridCache
{
    /// <summary>
    /// Inner.
    /// </summary>
    public HybridCache Inner { get; } = inner;

    /// <summary>
    /// Key prefix isolation function.
    /// </summary>
    public Func<string, string> GetKeyPrefix { get; } = getKeyPrefix;

    private string GetFullKey(string key)
    {
        Guard.NotNull(key, nameof(key));

        var prefix = GetKeyPrefix(key).WhiteSpaceToNull() ?? throw new Exception(MemoryCacheIsolation.NullPrefixError);

        return prefix + key;
    }

    /// <summary>
    /// Proxy to HybridCache.GetOrCreateAsync.
    /// </summary>
    public override ValueTask<T> GetOrCreateAsync<TState, T>(string key, TState state, Func<TState, CancellationToken, ValueTask<T>> factory, HybridCacheEntryOptions? options = null, IEnumerable<string>? tags = null, CancellationToken token = new ())
        => Inner.GetOrCreateAsync(GetFullKey(key), state, factory, options, tags, token);

    /// <summary>
    /// Proxy to HybridCache.SetAsync.
    /// </summary>
    public override ValueTask SetAsync<T>(string key, T value, HybridCacheEntryOptions? options = null, IEnumerable<string>? tags = null, CancellationToken token = new ())
        => Inner.SetAsync(GetFullKey(key), value, options, tags, token);

    /// <summary>
    /// Proxy to HybridCache.RemoveAsync.
    /// </summary>
    public override ValueTask RemoveAsync(string key, CancellationToken token = new ())
        => Inner.RemoveAsync(GetFullKey(key), token);

    /// <summary>
    /// Proxy to HybridCache.RemoveByTagAsync.
    /// </summary>
    public override ValueTask RemoveByTagAsync(string tag, CancellationToken token = new ())
        => Inner.RemoveByTagAsync(tag, token);
}
