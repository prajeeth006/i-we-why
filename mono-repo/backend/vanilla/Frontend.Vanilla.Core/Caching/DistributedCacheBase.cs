using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Core.Caching;

/// <summary>
/// Base class which replaces method pairs with single one with <see cref="ExecutionMode" /> and adds validation of input parameters.
/// </summary>
internal abstract class DistributedCacheBase : IDistributedCache
{
    // Methods for implementors
    public abstract Task<byte[]?> GetAsync(ExecutionMode mode, string key);
    public abstract Task SetAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options);
    public abstract Task RefreshAsync(ExecutionMode mode, string key);
    public abstract Task RemoveAsync(ExecutionMode mode, string key);

    // IDistributedCache methods handling ExecutionMode
    public byte[]? Get(string key)
        => ExecutionMode.ExecuteSync(GetInternalAsync, key);

    public Task<byte[]?> GetAsync(string key, CancellationToken token)
        => GetInternalAsync(ExecutionMode.Async(token), key);

    public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
        => ExecutionMode.ExecuteSync(SetInternalAsync, key, value, options);

    public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token)
        => SetInternalAsync(ExecutionMode.Async(token), key, value, options);

    public void Refresh(string key)
        => ExecutionMode.ExecuteSync(RefreshInternalAsync, key);

    public Task RefreshAsync(string key, CancellationToken token)
        => RefreshInternalAsync(ExecutionMode.Async(token), key);

    public void Remove(string key)
        => ExecutionMode.ExecuteSync(RemoveInternalAsync, key);

    public Task RemoveAsync(string key, CancellationToken token)
        => RemoveInternalAsync(ExecutionMode.Async(token), key);

    // Methods doing parameter validation
    private Task<byte[]?> GetInternalAsync(ExecutionMode mode, string key)
        => GetAsync(mode, Guard.NotNull(key, nameof(key)));

    private Task SetInternalAsync(ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
        => SetAsync(
            mode,
            Guard.NotNull(key, nameof(key)),
            Guard.NotNull(value, nameof(value)),
            Guard.NotNull(options, nameof(options)));

    private Task RefreshInternalAsync(ExecutionMode mode, string key)
        => RefreshAsync(mode, Guard.NotNull(key, nameof(key)));

    private Task RemoveInternalAsync(ExecutionMode mode, string key)
        => RemoveAsync(mode, Guard.NotNull(key, nameof(key)));
}
