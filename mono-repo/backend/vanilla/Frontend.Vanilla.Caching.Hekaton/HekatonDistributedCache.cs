using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Caching.Hekaton.DataLayer;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Caching.Hekaton;

/// <summary>
/// Implementation of <see cref="IDistributedCache" /> which stores values in Hekaton database.
/// </summary>
internal sealed class HekatonDistributedCache(
    IHekatonDataLayer dataLayer,
    ICacheExpirationCalculator expirationCalculator)
    : DistributedCacheBase
{
    public override Task<byte[]?> GetAsync(ExecutionMode mode, string key)
        => dataLayer.GetAsync(mode, key);

    public override Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
        => ExecuteNonQueryAsync(
            key,
            executeAsync: fullKey =>
            {
                var expiration = expirationCalculator.Calculate(options, fullKey);

                return dataLayer.SetAsync(mode, fullKey, value, expiration);
            });

    public override Task RefreshAsync(ExecutionMode mode, string key)
        => ExecuteNonQueryAsync(key, k => dataLayer.RefreshAsync(mode, k));

    public override Task RemoveAsync(ExecutionMode mode, string key)
        => ExecuteNonQueryAsync(key, k => dataLayer.RemoveAsync(mode, k));

    private Task ExecuteNonQueryAsync(string key, Func<string, Task> executeAsync)
        => executeAsync(key);
}
