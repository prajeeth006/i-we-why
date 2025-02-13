#nullable enable

using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Caching;

/// <summary>
/// Base class which collapses sync + async methods to one with <see cref="ExecutionMode" />.
/// </summary>
internal abstract class PosApiDataCacheBase : IPosApiDataCache
{
    public abstract Task<Wrapper<T>?> GetAsync<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
        where T : notnull;

    public abstract Task SetAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration);

    public abstract Task RemoveAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key);

    public abstract Task<T> GetOrCreateAsync<T>(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        bool cached = true,
        TimeSpan? relativeExpiration = null)
        where T : notnull;

    Wrapper<T>? IPosApiDataCache.Get<T>(PosApiDataType dataType, RequiredString key)
        => ExecutionMode.ExecuteSync(GetAsync<T>, dataType, key);

    Task<Wrapper<T>?> IPosApiDataCache.GetAsync<T>(PosApiDataType dataType, RequiredString key, CancellationToken cancellationToken)
        => GetAsync<T>(ExecutionMode.Async(cancellationToken), dataType, key);

    void IPosApiDataCache.Set(PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration)
        => ExecutionMode.ExecuteSync(SetAsync, dataType, key, value, relativeExpiration);

    Task IPosApiDataCache.SetAsync(PosApiDataType dataType, RequiredString key, object value, CancellationToken cancellationToken, TimeSpan? relativeExpiration)
        => SetAsync(ExecutionMode.Async(cancellationToken), dataType, key, value, relativeExpiration);

    void IPosApiDataCache.Remove(PosApiDataType dataType, RequiredString key)
        => ExecutionMode.ExecuteSync(RemoveAsync, dataType, key);

    Task IPosApiDataCache.RemoveAsync(PosApiDataType dataType, RequiredString key, CancellationToken cancellationToken)
        => RemoveAsync(ExecutionMode.Async(cancellationToken), dataType, key);

    T IPosApiDataCache.GetOrCreate<T>(PosApiDataType dataType, RequiredString key, Func<T> valueFactory, bool cached, TimeSpan? relativeExpiration)
        => ExecutionMode.ExecuteSync(GetOrCreateAsync(ExecutionMode.Sync, dataType, key, () => Task.FromResult(valueFactory()), cached, relativeExpiration));

    Task<T> IPosApiDataCache.GetOrCreateAsync<T>(
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        CancellationToken cancellationToken,
        bool cached,
        TimeSpan? relativeExpiration)
        => GetOrCreateAsync(ExecutionMode.Async(cancellationToken), dataType, key, valueFactory, cached, relativeExpiration);
}
