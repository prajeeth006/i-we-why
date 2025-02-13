using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Account.ProductLicenseInfos;

internal interface IProductLicenseInfosServiceClient
{
    Task<IReadOnlyList<LicenseInfo>> GetAsync(ExecutionMode mode, bool cached);
}

internal sealed class ProductLicenseInfosServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache) : IProductLicenseInfosServiceClient
{
    public Task<IReadOnlyList<LicenseInfo>> GetAsync(ExecutionMode mode, bool cached = true)
    {
        return cache.GetOrCreateAsync(
            mode,
            PosApiDataType.User,
            "ProductLicenseInfos",
            async () =>
            {
                var request =
                    new PosApiRestRequest(PosApiEndpoint.Account.ProductLicenseInfos)
                    {
                        Authenticate = true,
                    };

                var result = await restClient.ExecuteAsync<IReadOnlyList<LicenseInfo>>(mode, request);

                return result;
            },
            cached);
    }
}

#pragma warning disable CS1591 // Just dummy data -> no docs needed
public sealed class LicenseInfo
{
    public string LicenseCode { get; set; }
    public bool LicenseAccepted { get; set; }
}
