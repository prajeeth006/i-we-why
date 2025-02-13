#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;

public sealed class ActivitySummary(
    string accountCurrency = "",
    decimal netProfit = 0,
    decimal netLoss = 0,
    decimal pokerTaxCollected = 0,
    decimal casinoTaxCollected = 0,
    decimal sportsTaxCollected = 0)
{
    public string AccountCurrency { get; } = accountCurrency;
    public decimal NetProfit { get; } = netProfit;
    public decimal NetLoss { get; } = netLoss;
    public decimal PokerTaxCollected { get; } = pokerTaxCollected;
    public decimal CasinoTaxCollected { get; } = casinoTaxCollected;
    public decimal SportsTaxCollected { get; } = sportsTaxCollected;

    internal static ActivitySummary Create(ActivitySummaryDto dto)
        => new (
            accountCurrency: dto.AccountCurrency,
            netProfit: dto.NetProfit,
            netLoss: dto.NetLoss,
            pokerTaxCollected: dto.PokerTaxCollected,
            casinoTaxCollected: dto.CasinoTaxCollected,
            sportsTaxCollected: dto.SportsTaxCollected);
}
