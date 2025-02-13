using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;

internal interface ILoyaltyProfileServiceClient : ICachedUserDataServiceClient<LoyaltyProfile> { }

internal class LoyaltyProfileServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<LoyaltyProfile, LoyaltyProfile>
    (getDataServiceClient, PosApiEndpoint.Crm.LoyaltyProfile), ILoyaltyProfileServiceClient { }
