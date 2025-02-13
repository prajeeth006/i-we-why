using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.AssociatedAccounts;

internal interface IAssociatedAccountsServiceClient : ICachedUserDataServiceClient<IReadOnlyList<AssociatedAccount>> { }

internal sealed class AssociatedAccountsServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<AssociatedAccountsResponse, IReadOnlyList<AssociatedAccount>>(getDataServiceClient,
            dataUrl: PosApiEndpoint.Account.AssociatedAccounts,
            cacheKey: "AssociatedAccounts"),
        IAssociatedAccountsServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
