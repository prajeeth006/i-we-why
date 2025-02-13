using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Core.Caching.Isolation;

/// <summary>
/// Methods for isolating <see cref="IDistributedCache" />.
/// </summary>
public static class DistributedCacheIsolation
{
    /// <summary>
    /// Isolates cache entries by prepending their keys with given constant prefix.
    /// </summary>
    public static IDistributedCache IsolateBy(this IDistributedCache cache, string keyPrefix)
    {
        Guard.NotNull(cache, nameof(cache));
        Guard.NotWhiteSpace(keyPrefix, nameof(keyPrefix));

        return cache.IsolateBy(_ => keyPrefix);
    }

    internal static IDistributedCache IsolateBy(this IDistributedCache cache, Func<string, string> getIsolationPrefix)
        => new IsolatedDistributedCache(cache, getIsolationPrefix);
}

internal sealed class IsolatedDistributedCache(IDistributedCache inner, Func<string, string> getKeyPrefix) : DistributedCacheBase
{
    public IDistributedCache Inner { get; } = inner;
    public Func<string, string> GetKeyPrefix { get; } = getKeyPrefix;

    private string GetFullKey(string key)
    {
        Guard.NotNull(key, nameof(key));

        var prefix = GetKeyPrefix(key).WhiteSpaceToNull() ?? throw new Exception(MemoryCacheIsolation.NullPrefixError);

        return prefix + key;
    }

    public override Task<byte[]?> GetAsync(ExecutionMode mode, string key)
        => Inner.GetAsync(mode, GetFullKey(key));

    public override Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
        => Inner.SetAsync(mode, GetFullKey(key), value, options);

    public override Task RefreshAsync(ExecutionMode mode, string key)
        => Inner.RefreshAsync(mode, GetFullKey(key));

    public override Task RemoveAsync(ExecutionMode mode, string key)
        => Inner.RemoveAsync(mode, GetFullKey(key));
}
