#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

/// <summary>
/// Generic service client which just GETs data from given URL and caches them based on this URL.
/// </summary>
internal interface IGetDataServiceClient
{
    Task<TData> GetAsync<TDto, TData>(ExecutionMode mode, PosApiDataType dataType, PathRelativeUri url, bool cached = true, RequiredString? cacheKey = null, TimeSpan? relativeExpiration = null)
        where TDto : IPosApiResponse<TData>
        where TData : notnull;

    void InvalidateCached(PosApiDataType dataType, RequiredString cacheKey);

    void SetToCache(PosApiDataType dataType, RequiredString cacheKey, object data);
}

internal interface IPosApiResponse<out TData>
    where TData : notnull
{
    TData GetData();
}

internal sealed class GetDataServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache) : IGetDataServiceClient
{
    public Task<TData> GetAsync<TDto, TData>(ExecutionMode mode, PosApiDataType dataType, PathRelativeUri url, bool cached, RequiredString? cacheKey, TimeSpan? relativeExpiration = null)
        where TDto : IPosApiResponse<TData>
        where TData : notnull
    {
        return cache.GetOrCreateAsync(mode, dataType, cacheKey ?? url.ToString(), ExecuteFreshAsync, cached, relativeExpiration);

        async Task<TData> ExecuteFreshAsync()
        {
            var request = new PosApiRestRequest(url) { Authenticate = dataType == PosApiDataType.User };
            var dto = await restClient.ExecuteAsync<TDto>(mode, request)
                      ?? throw new Exception($"Request to '{url}' was successful but returned DTO {typeof(TDto)} is null.");

            var data = dto.GetData();

            return data ?? throw new Exception($"Request to '{url}' was successful but final data {typeof(TData)} from DTO {typeof(TDto)} is null.");
        }
    }

    public void InvalidateCached(PosApiDataType dataType, RequiredString cacheKey)
        => cache.Remove(dataType, cacheKey);

    public void SetToCache(PosApiDataType dataType, RequiredString cacheKey, object data)
        => cache.Set(dataType, cacheKey, data);
}
