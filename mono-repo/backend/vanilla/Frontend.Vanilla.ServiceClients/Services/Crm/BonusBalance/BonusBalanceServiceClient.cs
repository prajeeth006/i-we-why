using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;

internal interface IBonusBalanceServiceClient : ICachedUserDataServiceClient<IReadOnlyDictionary<string, ProductBonusInfo>> { }

internal sealed class BonusBalanceServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<BonusBalanceResponse, IReadOnlyDictionary<string, ProductBonusInfo>>
        (getDataServiceClient, PosApiEndpoint.Crm.BonusBalance, cacheKey: "BonusBalance"), IBonusBalanceServiceClient { }
