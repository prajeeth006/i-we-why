using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;

internal interface IInvitationUrlServiceClient : ICachedUserDataServiceClient<InvitationUrl> { }

internal class InvitationUrlServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<InvitationUrl, InvitationUrl>
    (getDataServiceClient, PosApiEndpoint.Crm.InvitationUrl, cacheKey: "InvitationUrl"), IInvitationUrlServiceClient { }
