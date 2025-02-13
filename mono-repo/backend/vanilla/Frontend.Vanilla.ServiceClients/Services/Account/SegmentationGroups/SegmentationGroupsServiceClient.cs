using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.SegmentationGroups;

/// <summary>
/// Implementation of <see cref="IPosApiAccountService.GetSegmentationGroups" />.
/// </summary>
internal interface ISegmentationGroupsServiceClient : ICachedUserDataServiceClient<IReadOnlyList<string>> { }

internal sealed class SegmentationGroupsServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<SegmentationGroupsResponse, IReadOnlyList<string>>
        (getDataServiceClient, PosApiEndpoint.Account.UserSegmentationGroups, cacheKey: "SegmentationGroups"), ISegmentationGroupsServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
