using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

/// <summary>
/// Base (to be inherited, not included) service client for handling single user data retrieved without parameters.
/// </summary>
internal interface ICachedUserDataServiceClient<TData>
{
    [NotNull, ItemNotNull]
    Task<TData> GetCachedAsync(ExecutionMode mode);

    [NotNull, ItemNotNull]
    Task<TData> GetAsync(ExecutionMode mode, bool cached);

    void InvalidateCached();

    void SetToCache([NotNull] TData data);
}

internal abstract class CachedUserDataServiceClient<TDto, TData>(
    [NotNull] IGetDataServiceClient getDataServiceClient,
    [NotNull] PathRelativeUri dataUrl,
    RequiredString cacheKey = null)
    : ICachedUserDataServiceClient<TData>
    where TDto : class, IPosApiResponse<TData>
{
    private const PosApiDataType DataType = PosApiDataType.User;
    private readonly IGetDataServiceClient getDataServiceClient = Guard.NotNull(getDataServiceClient, nameof(getDataServiceClient));

    // Public for easier unit testing
    public PathRelativeUri DataUrl { get; } = Guard.NotNull(dataUrl, nameof(dataUrl));
    public RequiredString CacheKey { get; } = cacheKey ?? typeof(TData).Name.Substring(typeof(TData).IsInterface ? 1 : 0);

    public Task<TData> GetCachedAsync(ExecutionMode mode)
        => GetAsync(mode, true);

    public Task<TData> GetAsync(ExecutionMode mode, bool cached)
        => getDataServiceClient.GetAsync<TDto, TData>(mode, DataType, DataUrl, cached, CacheKey);

    public void InvalidateCached()
        => getDataServiceClient.InvalidateCached(DataType, CacheKey);

    public void SetToCache(TData data)
        => getDataServiceClient.SetToCache(DataType, CacheKey, data);

    static CachedUserDataServiceClient()
    {
        Validate(typeof(TDto), nameof(TDto));
        Validate(typeof(TData), nameof(TData));
    }

    private static void Validate(Type type, string paramName)
    {
        if (type.IsValueType || type.IsFinalClass()) return;

        if (type.IsGenericType && new[] { typeof(IReadOnlyList<>), typeof(IReadOnlyDictionary<,>) }.Any(t => t == type.GetGenericTypeDefinition()))
        {
            foreach (var arg in type.GetGenericArguments())
            {
                Validate(arg, paramName);
            }
        }
        else
            throw new Exception(
                $"{paramName} must be a final class, struct or known type so that Newtonsoft.JSON can deserialize it from PosAPI or distributed cache, but it's of type {type.FullName}");
    }
}
