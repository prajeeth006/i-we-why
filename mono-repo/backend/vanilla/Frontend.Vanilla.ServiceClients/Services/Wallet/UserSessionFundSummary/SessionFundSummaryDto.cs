namespace Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;

internal sealed class SessionFundSummaryDto(decimal currentBalance = 0, decimal initialBalance = 0, decimal loss = 0, decimal profit = 0, decimal totalStake = 0)
{
    public decimal CurrentBalance { get; set; } = currentBalance;

    public decimal InitialBalance { get; set; } = initialBalance;

    public decimal Loss { get; set; } = loss;

    public decimal Profit { get; set; } = profit;

    public decimal TotalStake { get; set; } = totalStake;

    internal static SessionFundSummaryDto Create(SessionFundSummary dto)
        => new SessionFundSummaryDto(
            currentBalance: dto.CurrentBalance,
            initialBalance: dto.InitialBalance,
            loss: dto.Loss,
            profit: dto.Profit,
            totalStake: dto.TotalStake);
}
