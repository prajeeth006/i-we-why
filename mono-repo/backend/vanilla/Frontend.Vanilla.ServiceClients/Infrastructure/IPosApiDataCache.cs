#nullable enable

using System;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Cache for data retrieved from PosAPI handling expiration according to config.
/// Also it's <see cref="GetOrCreate{T}" /> method guarantees single execution for particular key + dataType at the same time.
/// </summary>
public interface IPosApiDataCache
{
    /// <summary>Gets wrapped cached value for given key and data type. Returns <see langword="null" /> if cached one isn't found.</summary>
    Wrapper<T>? Get<T>(PosApiDataType dataType, RequiredString key)
        where T : notnull;

    /// <summary>Gets wrapped cached value for given key and data type. Returns <see langword="null" /> if cached one isn't found.</summary>
    Task<Wrapper<T>?> GetAsync<T>(PosApiDataType dataType, RequiredString key, CancellationToken cancellationToken)
        where T : notnull;

    /// <summary>Gets wrapped cached value for given key and data type. Returns <see langword="null" /> if cached one isn't found.</summary>
    Task<Wrapper<T>?> GetAsync<T>(ExecutionMode mode, PosApiDataType dataType, RequiredString key)
        where T : notnull;

    /// <summary>
    /// Inserts a cache entry with given value into the cache for specified key and data type.
    /// If expiration is not provided then it's calculated according to data type and <see cref="IServiceClientsConfiguration" />.
    /// </summary>
    void Set(PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration = null);

    /// <summary>
    /// Inserts a cache entry with given value into the cache for specified key and data type.
    /// If expiration is not provided then it's calculated according to data type and <see cref="IServiceClientsConfiguration" />.
    /// </summary>
    Task SetAsync(PosApiDataType dataType, RequiredString key, object value, CancellationToken cancellationToken, TimeSpan? relativeExpiration = null);

    /// <summary>
    /// Inserts a cache entry with given value into the cache for specified key and data type.
    /// If expiration is not provided then it's calculated according to data type and <see cref="IServiceClientsConfiguration" />.
    /// </summary>
    Task SetAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key, object value, TimeSpan? relativeExpiration = null);

    /// <summary>
    /// Removes cached value for given key and data type.
    /// </summary>
    void Remove(PosApiDataType dataType, RequiredString key);

    /// <summary>
    /// Removes cached value for given key and data type.
    /// </summary>
    Task RemoveAsync(PosApiDataType dataType, RequiredString key, CancellationToken cancellationToken);

    /// <summary>
    /// Removes cached value for given key and data type.
    /// </summary>
    Task RemoveAsync(ExecutionMode mode, PosApiDataType dataType, RequiredString key);

    /// <summary>
    /// Gets cached value for given key and data type or creates new one using given delegate and adds it into the cache.
    /// If expiration is not provided then it's calculated according to data type and <see cref="IServiceClientsConfiguration" />.
    /// The execution of factory method is locked so that only single thread can create the value.
    /// </summary>
    T GetOrCreate<T>(
        PosApiDataType dataType,
        RequiredString key,
        Func<T> valueFactory,
        bool cached = true,
        TimeSpan? relativeExpiration = null)
        where T : notnull;

    /// <summary>
    /// Gets cached value for given key and data type or creates new one using given delegate and adds it into the cache.
    /// If expiration is not provided then it's calculated according to data type and <see cref="IServiceClientsConfiguration" />.
    /// The execution of factory method is locked so that only single thread can create the value.
    /// </summary>
    Task<T> GetOrCreateAsync<T>(
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        CancellationToken cancellationToken,
        bool cached = true,
        TimeSpan? relativeExpiration = null)
        where T : notnull;

    /// <summary>
    /// Gets cached value for given key and data type or creates new one using given delegate and adds it into the cache.
    /// If expiration is not provided then it's calculated according to data type and <see cref="IServiceClientsConfiguration" />.
    /// The execution of factory method is locked so that only single thread can create the value.
    /// </summary>
    Task<T> GetOrCreateAsync<T>(
        ExecutionMode mode,
        PosApiDataType dataType,
        RequiredString key,
        Func<Task<T>> valueFactory,
        bool cached = true,
        TimeSpan? relativeExpiration = null)
        where T : notnull;
}

/// <summary>
/// Determines type of cached PosAPI data.
/// </summary>
public enum PosApiDataType
{
    /// <summary>Static data that can be cached regardless of the user.</summary>
    Static = 0,

    /// <summary>User-specific data that have to be cached per user.</summary>
    User = 1,
}
