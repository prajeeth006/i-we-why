namespace Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;

internal sealed class NetLossInfoDto(decimal netLoss = 0, decimal netDeposit = 0, decimal netWithdrawal = 0)
{
    public decimal NetLoss { get; } = netLoss;
    public decimal NetDeposit { get; } = netDeposit;
    public decimal NetWithdrawal { get; } = netWithdrawal;
}
