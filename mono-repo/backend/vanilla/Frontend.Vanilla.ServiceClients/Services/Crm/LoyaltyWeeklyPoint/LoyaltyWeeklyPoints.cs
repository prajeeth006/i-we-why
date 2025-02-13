using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;

internal sealed class LoyaltyWeeklyPoints(decimal points) : IPosApiResponse<LoyaltyWeeklyPoints>
{
    public decimal Points { get; } = points;

    public LoyaltyWeeklyPoints GetData() => this;
}
