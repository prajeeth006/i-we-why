namespace Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

internal class WeeklyPokerPoints(
    decimal weeklyPoints,
    decimal currentTarget,
    decimal currentCashback,
    decimal targetCashback,
    string isOptIn,
    string currency,
    decimal currentSlabPoints,
    decimal nextSlabPoints,
    string awardType)
{
    public decimal WeeklyPoints { get; } = weeklyPoints;
    public decimal CurrentTarget { get; } = currentTarget;
    public decimal CurrentCashback { get; } = currentCashback;
    public decimal TargetCashback { get; } = targetCashback;
    public string IsOptIn { get; } = isOptIn;
    public string Currency { get; } = currency;
    public decimal CurrentSlabPoints { get; } = currentSlabPoints;
    public decimal NextSlabPoints { get; } = nextSlabPoints;
    public string AwardType { get; } = awardType;
    public bool HasOptedIn { get; } = isOptIn?.ToLower().Equals("y") ?? false;
    public decimal PointsRequiredForNextSlab { get; } = nextSlabPoints - weeklyPoints;
}
