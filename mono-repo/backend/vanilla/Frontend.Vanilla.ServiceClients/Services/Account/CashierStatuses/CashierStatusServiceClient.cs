using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;

internal interface ICashierStatusServiceClient : ICachedUserDataServiceClient<CashierStatus> { }

internal sealed class CashierStatusServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<CashierStatusDto, CashierStatus>(
    getDataServiceClient,
    dataUrl: PosApiEndpoint.Account.CashierStatus,
    cacheKey: "CashierStatus"), ICashierStatusServiceClient { }
