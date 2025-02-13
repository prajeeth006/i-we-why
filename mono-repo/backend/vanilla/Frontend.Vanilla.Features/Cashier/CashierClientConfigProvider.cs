using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.Cashier;

internal sealed class CashierClientConfigProvider(ICashierConfiguration cashierConfiguration) : LambdaClientConfigProvider("vnCashier",
    () => new
    {
        cashierConfiguration.DepositUrlTemplate,
        cashierConfiguration.Host,
        cashierConfiguration.SingleSignOnIntegrationType,
        cashierConfiguration.TrackerIds,
        cashierConfiguration.QuickDepositAllowedOrigins,
        cashierConfiguration.TransactionHistoryUrlTemplate,
        cashierConfiguration.UrlTemplate,
        cashierConfiguration.ManageMyCardsUrlTemplate,
        cashierConfiguration.WithdrawUrlTemplate,
        cashierConfiguration.QuickDepositUrlTemplate,
        cashierConfiguration.PaymentPreferencesUrlTemplate,
        cashierConfiguration.IsQuickDepositEnabled,
    })
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
