using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyPoint;

/// <summary>
/// Gets proper type of loyalty points according to the configuration.
/// </summary>
internal interface ILoyaltyPointsServiceClient
{
    Task<decimal> GetAsync(ExecutionMode mode);
}

internal sealed class LoyaltyPointsServiceClient(
    ILoyaltyConfiguration config,
    IBasicLoyaltyProfileServiceClient basicProfileServiceClient,
    ILoyaltyWeeklyPointsServiceClient weeklyPointsServiceClient)
    : ILoyaltyPointsServiceClient
{
    public async Task<decimal> GetAsync(ExecutionMode mode)
    {
        switch (config.Points)
        {
            case LoyaltyPointsBalance.Total:
                var profile = await basicProfileServiceClient.GetCachedAsync(mode);

                return profile.Points;

            case LoyaltyPointsBalance.ThisWeek:
                var weeklyPoints = await weeklyPointsServiceClient.GetCachedAsync(mode);

                return weeklyPoints.Points;

            default:
                throw config.Points.GetInvalidException();
        }
    }
}
