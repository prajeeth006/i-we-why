using System.Threading.Tasks;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Core.Caching;

/// <summary>Prefixes key with current environment.</summary>
internal sealed class EnvironmentIsolatedDistributedCache(IDistributedCache inner, IEnvironmentProvider environmentProvider)
    : DistributedCacheBase
{
    private string GetKey(string key) => $"{environmentProvider.Environment}:{key}";
    public override Task<byte[]?> GetAsync(ExecutionMode mode, string key)
        => inner.GetAsync(mode, GetKey(key));

    public override Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
        => inner.SetAsync(mode, GetKey(key), value, options);

    public override Task RefreshAsync(ExecutionMode mode, string key)
        => inner.RefreshAsync(mode, GetKey(key));

    public override Task RemoveAsync(ExecutionMode mode, string key)
        => inner.RemoveAsync(mode, GetKey(key));
}
