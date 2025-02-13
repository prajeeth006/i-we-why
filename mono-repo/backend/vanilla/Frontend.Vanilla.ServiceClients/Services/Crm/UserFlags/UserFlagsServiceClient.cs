using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;

internal interface IUserFlagsServiceClient : ICachedUserDataServiceClient<IReadOnlyList<UserFlag>> { }

internal sealed class UserFlagsServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<UserFlagsResponse, IReadOnlyList<UserFlag>>
    (getDataServiceClient, PosApiEndpoint.Crm.PlayerFlags, cacheKey: "PlayerFlags"), IUserFlagsServiceClient { }
