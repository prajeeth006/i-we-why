#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Actual implementation of <see cref="IPosApiDataCache" />.
/// </summary>
internal sealed class PosApiDataCache(
    IServiceClientsConfiguration config,
    IStaticDataCache staticDataCache,
    IUserDataCache userDataCache,
    ICurrentUserAccessor currentUserAccessor,
    IPosApiRequestSemaphores requestSemaphores,
    ILogger<PosApiDataCache> log)
    : PosApiDataCacheBase
{
    private const string Disclaimer = "This error doesn't impact end-users directly but rendered values may be inconsistent or performance decreased.";

    public override Task<Wrapper<T>?> GetAsync<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
    {
        Guard.NotNull(key, nameof(key));

        var authTokens = ResolveAuthTokens(dataType);

        return GetCoreAsync<T>(mode, authTokens, dataType, key);
    }

    private async Task<Wrapper<T>?> GetCoreAsync<T>(ExecutionMode mode, PosApiAuthTokens? authTokens, PosApiDataType dataType, RequiredString key)
    {
        try
        {
            var value = authTokens != null
                ? await userDataCache.GetAsync(mode, authTokens, key, typeof(T))
                : await staticDataCache.GetAsync(mode, key, typeof(T));

            return value != null ? new Wrapper<T>((T)value) : null;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed getting PosAPI {dataType} of {resultType} from cache {key}." + Disclaimer, dataType, typeof(T), key);

            return default;
        }
    }

    public override Task SetAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration)
    {
        Guard.NotNull(key, nameof(key));
        Guard.NotNull(value, nameof(value));

        var expiration = CalculateExpiration(dataType, relativeExpiration);

        if (expiration <= TimeSpan.Zero)
            return Task.CompletedTask;

        var authTokens = ResolveAuthTokens(dataType);

        return SetCoreAsync(mode, authTokens, dataType, key, value, expiration);
    }

    private async Task SetCoreAsync(ExecutionMode mode, PosApiAuthTokens? authTokens, PosApiDataType dataType, RequiredString key, object value, TimeSpan expiration)
    {
        try
        {
            if (authTokens != null)
                await userDataCache.SetAsync(mode, authTokens, key, value, expiration);
            else
                await staticDataCache.SetAsync(mode, key, value, expiration);
        }
        catch (Exception ex)
        {
            var type = value.GetType();
            log.LogError(ex, "Failed setting PosAPI {dataType} of {type} to cache {key}." + Disclaimer, dataType, type, key);
        }
    }

    public override async Task RemoveAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
    {
        Guard.NotNull(key, nameof(key));

        var authTokens = ResolveAuthTokens(dataType);

        try
        {
            if (authTokens != null)
                await userDataCache.RemoveAsync(mode, authTokens, key);
            else
                await staticDataCache.RemoveAsync(mode, key);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed removing PosAPI {dataType} data from cache by {key}. " + Disclaimer, dataType, key);
        }
    }

    public override async Task<T> GetOrCreateAsync<T>(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        bool cached,
        TimeSpan? relativeExpiration)
    {
        Guard.NotNull(key, nameof(key));
        Guard.NotNull(valueFactory, nameof(valueFactory));

        var authTokens = new Lazy<PosApiAuthTokens?>(() => ResolveAuthTokens(dataType));
        var expiration = new Lazy<TimeSpan>(() => CalculateExpiration(dataType, relativeExpiration));

        void LogOutCome(bool isCacheMiss)
        {
            if (!config.IsApiCacheUsageStatsLoggingEnabled)
            {
                return;
            }

            log.LogInformation(
                "PosApi cache call with {key}, {isMiss}, {dataType}, {expiration}",
                key.Value,
                isCacheMiss,
                dataType,
                relativeExpiration?.TotalMilliseconds);
        }

        async Task<Wrapper<T>?> GetFromCache() => cached ? await GetCoreAsync<T>(mode, authTokens.Value, dataType, key) : null;

        async Task<Wrapper<T>> GetNewAndSaveToCache()
        {
            var freshValue = await ExecuteFactory(mode, dataType, key, valueFactory);
            await SetCoreAsync(mode, authTokens.Value, dataType, key, freshValue, expiration.Value);

            return freshValue;
        }

        async Task<Wrapper<T>> GetFromCacheOr(Func<Task<Wrapper<T>>> onCacheMiss)
        {
            var cacheEntry = await GetFromCache();
            var isCacheMiss = cacheEntry == null;

            if (isCacheMiss)
            {
                using (await requestSemaphores.WaitDisposableAsync(mode, dataType, key))
                {
                    cacheEntry = await GetFromCache();
                    isCacheMiss = cacheEntry == null;

                    if (isCacheMiss) // Double-checked locking
                    {
                        cacheEntry = await onCacheMiss();
                    }
                }
            }

            LogOutCome(isCacheMiss);
#pragma warning disable CS8603 // Possible null reference return.
            return cacheEntry;
#pragma warning restore CS8603 // Possible null reference return.
        }

        // If caching disabled
        if (expiration.Value <= TimeSpan.Zero)
        {
            LogOutCome(false);

            // Don't even bother checking the cache & locking
            return await ExecuteFactory(mode, dataType, key, valueFactory);
        }

        var cacheEntry = await GetFromCacheOr(GetNewAndSaveToCache);

        return cacheEntry.Value;
    }

    private static async Task<T> ExecuteFactory<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key, Func<Task<T>> valueFactory)
    {
        var task = valueFactory() ?? throw new Exception($"Factory for {typeof(T)} returned null task hence it can't be awaited. DataType: {dataType}, Key: '{key}'.");
        var freshValue = mode.AsyncCancellationToken != null ? await task : ExecutionMode.ExecuteSync(task);

        return freshValue != null
            ? freshValue
            : throw new Exception($"Result from factory for {typeof(T)} is null which can't be cached. DataType: {dataType}, Key: '{key}'.");
    }

    private TimeSpan CalculateExpiration(PosApiDataType dataType, TimeSpan? relativeExpiration)
        => relativeExpiration ?? (dataType == PosApiDataType.User ? config.UserDataCacheTime : config.StaticDataCacheTime);

    private PosApiAuthTokens? ResolveAuthTokens(PosApiDataType dataType)
        => dataType switch
        {
            PosApiDataType.User => currentUserAccessor.User.GetRequiredPosApiAuthTokens(),
            PosApiDataType.Static => null,
            _ => throw dataType.GetInvalidException(),
        };
}
