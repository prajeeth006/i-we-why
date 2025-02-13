using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;

internal interface IConnectedAccountsServiceClient : ICachedUserDataServiceClient<IReadOnlyList<ConnectedAccount>> { }

internal sealed class ConnectedAccountsServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<ConnectedAccountsResponse, IReadOnlyList<ConnectedAccount>>(getDataServiceClient,
            dataUrl: PosApiEndpoint.Account.DeUnregisteredBrandsV2,
            cacheKey: "De-UnregisteredBrandsV2"),
        IConnectedAccountsServiceClient { }
