using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;

internal interface ICampaignDataServiceClient : ICachedUserDataServiceClient<IReadOnlyList<CampaignData>> { }

internal sealed class CampaignDataServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<CampaignDataResponse, IReadOnlyList<CampaignData>>
        (getDataServiceClient, PosApiEndpoint.Crm.CampaignData, cacheKey: "UserCampaigns"), ICampaignDataServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
