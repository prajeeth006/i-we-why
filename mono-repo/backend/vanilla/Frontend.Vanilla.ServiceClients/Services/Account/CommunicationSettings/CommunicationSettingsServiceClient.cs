using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;

internal interface ICommunicationSettingsServiceClient : ICachedUserDataServiceClient<IReadOnlyList<CommunicationType>> { }

internal sealed class CommunicationSettingsServiceClient(IGetDataServiceClient getDataServiceClient)
    : CachedUserDataServiceClient<CommunicationSettingsResponse, IReadOnlyList<CommunicationType>>(getDataServiceClient,
            dataUrl: PosApiEndpoint.Account.CommunicationSettings,
            cacheKey: "CommunicationSettings"),
        ICommunicationSettingsServiceClient
{
    // Used with distributed cache -> must match between products -> don't change!!!
}
