namespace Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;

internal sealed class ActivitySummaryDto(
    string accountCurrency = "",
    decimal netProfit = 0,
    decimal netLoss = 0,
    decimal pokerTaxCollected = 0,
    decimal casinoTaxCollected = 0,
    decimal sportsTaxCollected = 0)
{
    public string AccountCurrency { get; set; } = accountCurrency;
    public decimal NetProfit { get; set; } = netProfit;
    public decimal NetLoss { get; set; } = netLoss;
    public decimal PokerTaxCollected { get; set; } = pokerTaxCollected;
    public decimal CasinoTaxCollected { get; set; } = casinoTaxCollected;
    public decimal SportsTaxCollected { get; set; } = sportsTaxCollected;

    public static ActivitySummaryDto Create(ActivitySummary model)
        => new (
            accountCurrency: model.AccountCurrency,
            netProfit: model.NetProfit,
            netLoss: model.NetLoss,
            pokerTaxCollected: model.PokerTaxCollected,
            casinoTaxCollected: model.CasinoTaxCollected,
            sportsTaxCollected: model.SportsTaxCollected);
}
