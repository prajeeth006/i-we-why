#nullable enable

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

/// <summary>
/// Part of <see cref="Balance" /> which is specific for a product app so it's cached accordingly.
/// </summary>
internal sealed class ProductSpecificBalanceCachedDto(
    decimal balanceForGameType,
    decimal cashoutRestrictedBalance,
    decimal payPalBalance,
    decimal payPalRestrictedBalance)
{
    public decimal BalanceForGameType { get; } = balanceForGameType;
    public decimal CashoutRestrictedBalance { get; } = cashoutRestrictedBalance;
    public decimal PayPalBalance { get; } = payPalBalance;
    public decimal PayPalRestrictedBalance { get; } = payPalRestrictedBalance;

    public static ProductSpecificBalanceCachedDto Create(Balance balance)
        => new ProductSpecificBalanceCachedDto(
            balanceForGameType: balance.BalanceForGameType,
            cashoutRestrictedBalance: balance.CashoutRestrictedBalance,
            payPalBalance: balance.PayPalBalance,
            payPalRestrictedBalance: balance.PayPalRestrictedBalance);
}
