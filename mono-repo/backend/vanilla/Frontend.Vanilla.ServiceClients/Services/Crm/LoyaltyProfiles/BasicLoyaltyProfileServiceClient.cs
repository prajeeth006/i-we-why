using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;

internal interface IBasicLoyaltyProfileServiceClient : ICachedUserDataServiceClient<BasicLoyaltyProfile> { }

internal class BasicLoyaltyProfileServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<BasicLoyaltyProfile, BasicLoyaltyProfile>
    (getDataServiceClient, PosApiEndpoint.Crm.BasicLoyaltyProfile, cacheKey: "BasicLoyaltyProfile"), IBasicLoyaltyProfileServiceClient { }
