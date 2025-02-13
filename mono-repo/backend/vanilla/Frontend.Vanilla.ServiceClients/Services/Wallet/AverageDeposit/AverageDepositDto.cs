namespace Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;

internal sealed class AverageDepositDto(decimal labelAverageDepositAmount = 0, decimal userAverageDepositAmount = 0)
{
    public decimal LabelAverageDepositAmount { get; } = labelAverageDepositAmount;
    public decimal UserAverageDepositAmount { get; } = userAverageDepositAmount;
}
