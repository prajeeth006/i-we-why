using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;

internal interface IReferredFriendsServiceClient : ICachedUserDataServiceClient<ReferredFriends> { }

internal class ReferredFriendsServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<ReferredFriends, ReferredFriends>
    (getDataServiceClient, PosApiEndpoint.Crm.ReferredFriends, cacheKey: "ReferredFriends"), IReferredFriendsServiceClient { }
