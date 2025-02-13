using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Caching.Distributed;

namespace Frontend.Vanilla.Core.Caching;

internal enum DistributedCacheType
{
    Redis = 1,
    Hekaton = 2,
}

internal static class DistributedCacheExtensions
{
    public static DistributedCacheType Current { get; } =
        VanillaEnvironment.IsDev
        || Environment.GetEnvironmentVariable("VANILLA_DISTRIBUTED_CACHE") == "redis"
        || Environment.GetEnvironmentVariable("Site") == "AT1AT2-DEV"
            ? DistributedCacheType.Redis
            : DistributedCacheType.Hekaton;

    public static Task<byte[]?> GetAsync(this IDistributedCache cache, ExecutionMode mode, string key)
        => mode.AsyncCancellationToken != null
            ? cache.GetAsync(key, mode.AsyncCancellationToken.Value)
            : Task.FromResult(cache.Get(key));

    public static Task<string?> GetStringAsync(this IDistributedCache cache, ExecutionMode mode, string key)
        => mode.AsyncCancellationToken != null
            ? cache.GetStringAsync(key, mode.AsyncCancellationToken.Value)
            : Task.FromResult(cache.GetString(key));

    public static Task SetAsync(this IDistributedCache cache, ExecutionMode mode, string key, byte[] value, DistributedCacheEntryOptions options)
    {
        if (mode.AsyncCancellationToken != null)
            return cache.SetAsync(key, value, options, mode.AsyncCancellationToken.Value);

        cache.Set(key, value, options);

        return Task.CompletedTask;
    }

    public static Task SetStringAsync(this IDistributedCache cache, ExecutionMode mode, string key, string value, DistributedCacheEntryOptions options)
    {
        if (mode.AsyncCancellationToken != null)
            return cache.SetStringAsync(key, value, options, mode.AsyncCancellationToken.Value);

        cache.SetString(key, value, options);

        return Task.CompletedTask;
    }

    public static Task RefreshAsync(this IDistributedCache cache, ExecutionMode mode, string key)
    {
        if (mode.AsyncCancellationToken != null)
            return cache.RefreshAsync(key, mode.AsyncCancellationToken.Value);

        cache.Refresh(key);

        return Task.CompletedTask;
    }

    public static Task RemoveAsync(this IDistributedCache cache, ExecutionMode mode, string key)
    {
        if (mode.AsyncCancellationToken != null)
            return cache.RemoveAsync(key, mode.AsyncCancellationToken.Value);

        cache.Remove(key);

        return Task.CompletedTask;
    }
}
