using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;

internal interface IMohDetailsServiceClient : ICachedUserDataServiceClient<MohDetailsResponse>
{
    Task<MohDetailsResponse> GetMohDetailsAsync(ExecutionMode mode, bool cached);
}

internal sealed class MohDetailsServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<MohDetailsResponse, MohDetailsResponse>(
    getDataServiceClient,
    dataUrl: PosApiEndpoint.Account.MohDetails,
    cacheKey: "MohDetails"), IMohDetailsServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
    public Task<MohDetailsResponse> GetMohDetailsAsync(ExecutionMode mode, bool cached)
    {
        if (!cached)
        {
            InvalidateCached();
        }

        return GetAsync(mode, cached);
    }
}
