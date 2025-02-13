#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

public sealed class TourneyTokenBalanceResponse
{
    public decimal TourneyTokenBalance { get; set; }
    public string TourneyTokenCurrency { get; set; }
}

internal sealed class TourneyTokenBalanceDto(string tourneyTokenCurrencyCode, decimal tourneyTokenBalance = 0)
{
    public string TourneyTokenCurrencyCode { get; } = tourneyTokenCurrencyCode;
    public decimal TourneyTokenBalance { get; } = tourneyTokenBalance;

    internal static TourneyTokenBalanceDto Create(TourneyTokenBalanceResponse dto, string tourneyTokenCurrencyCode)
        => new TourneyTokenBalanceDto(
            tourneyTokenBalance: dto.TourneyTokenBalance,
            tourneyTokenCurrencyCode: tourneyTokenCurrencyCode);
}
