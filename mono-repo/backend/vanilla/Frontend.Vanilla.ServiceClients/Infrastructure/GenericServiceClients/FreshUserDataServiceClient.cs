using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

/// <summary>
/// Generic service client for handling data retrieved without parameters and cache.
/// </summary>
internal interface IFreshUserDataServiceClient<TData>
{
    Task<TData> GetAsync(ExecutionMode mode);
}

internal abstract class FreshUserDataServiceClient<TDto, TData>(IPosApiRestClient restClient) : IFreshUserDataServiceClient<TData>
    where TDto : class, IPosApiResponse<TData>
{
    public abstract PathRelativeUri DataUrl { get; } // Public for easier unit testing

    public async Task<TData> GetAsync(ExecutionMode mode)
    {
        var request = new PosApiRestRequest(DataUrl) { Authenticate = true };

        var response = await restClient.ExecuteAsync<TDto>(mode, request);

        return response.GetData();
    }
}
