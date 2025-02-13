using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;

internal interface ILoyaltyWeeklyPointsServiceClient : ICachedUserDataServiceClient<LoyaltyWeeklyPoints> { }

internal class LoyaltyWeeklyPointsServiceClient(IGetDataServiceClient getDataServiceClient) : CachedUserDataServiceClient<LoyaltyWeeklyPoints, LoyaltyWeeklyPoints>
    (getDataServiceClient, PosApiEndpoint.Crm.WeekPoints, cacheKey: "ThisWeeksPoints"), ILoyaltyWeeklyPointsServiceClient { }
