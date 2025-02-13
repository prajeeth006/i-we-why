#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;

public sealed class SessionFundSummary(decimal currentBalance = 0, decimal initialBalance = 0, decimal loss = 0, decimal profit = 0, decimal totalStake = 0)
{
    public decimal CurrentBalance { get; } = currentBalance;

    public decimal InitialBalance { get; } = initialBalance;

    public decimal Loss { get; } = loss;

    public decimal Profit { get; } = profit;

    public decimal TotalStake { get; } = totalStake;

    internal static SessionFundSummary Create(SessionFundSummaryDto dto)
        => new SessionFundSummary(
            currentBalance: dto.CurrentBalance,
            initialBalance: dto.InitialBalance,
            loss: dto.Loss,
            profit: dto.Profit,
            totalStake: dto.TotalStake);
}
