using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;

internal interface IPlayerAttributesServiceClient : ICachedUserDataServiceClient<PlayerAttributesDto> { }

internal class PlayerAttributesServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<PlayerAttributesDto, PlayerAttributesDto>
    (getDataServiceClient, PosApiEndpoint.Crm.PersonalizedPlayerAttributes, cacheKey: "PlayerAttributes"), IPlayerAttributesServiceClient { }
