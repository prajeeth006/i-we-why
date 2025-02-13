using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;

internal interface IDepositLimitsServiceClient : ICachedUserDataServiceClient<IReadOnlyList<DepositLimit>> { }

internal sealed class DepositLimitsServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<DepositLimitResponse, IReadOnlyList<DepositLimit>>
        (getDataServiceClient, PosApiEndpoint.ResponsibleGaming.LimitsDepositV2, cacheKey: "LimitsDepositV2"), IDepositLimitsServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
