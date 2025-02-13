namespace Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;

internal sealed class ProfitLossSummaryDto(
    decimal totalReturn = 0,
    decimal totalStake = 0,
    decimal weeklyAverage = 0,
    decimal monthlyAverage = 0,
    decimal yearlyAverage = 0)
{
    public decimal TotalReturn { get; } = totalReturn;
    public decimal TotalStake { get; } = totalStake;
    public decimal WeeklyAverage { get; } = weeklyAverage;
    public decimal MonthlyAverage { get; } = monthlyAverage;
    public decimal YearlyAverage { get; } = yearlyAverage;
}
