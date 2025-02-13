using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IUserSummaryDslProvider" />.
/// </summary>
internal sealed class UserSummaryDslProvider(ICurrentUserAccessor currentUserAccessor, IPosApiWalletServiceInternal posApiWalletService)
    : IUserSummaryDslProvider
{
    private const decimal AnonymousValue = -1;

    public async Task<decimal> GetNetProfitAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var activitySummary = await posApiWalletService.GetPlayerActivitySummaryAsync(mode);

        return activitySummary.NetProfit;
    }

    public async Task<decimal> GetNetLossAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var activitySummary = await posApiWalletService.GetPlayerActivitySummaryAsync(mode);

        return activitySummary.NetLoss;
    }

    public async Task<decimal> GetPokerTaxCollectedAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var activitySummary = await posApiWalletService.GetPlayerActivitySummaryAsync(mode);

        return activitySummary.PokerTaxCollected;
    }

    public async Task<decimal> GetCasinoTaxCollectedAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var activitySummary = await posApiWalletService.GetPlayerActivitySummaryAsync(mode);

        return activitySummary.CasinoTaxCollected;
    }

    public async Task<decimal> GetSportsTaxCollectedAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var activitySummary = await posApiWalletService.GetPlayerActivitySummaryAsync(mode);

        return activitySummary.SportsTaxCollected;
    }

    public async Task<decimal> GetTotalDepositAmountAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var transactionSummary = await posApiWalletService.GetUserTransactionSummaryAsync(mode);

        return transactionSummary.TotalDepositamount;
    }

    public async Task<decimal> GetTotalWithdrawalAmountAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var transactionSummary = await posApiWalletService.GetUserTransactionSummaryAsync(mode);

        return transactionSummary.TotalWithdrawalamount;
    }

    public async Task<decimal> GetLossAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var transactionHistory = await posApiWalletService.GetTransactionHistoryAsync(mode);

        return transactionHistory.Loss;
    }

    public async Task<decimal> GetProfitAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return AnonymousValue;

        var transactionHistory = await posApiWalletService.GetTransactionHistoryAsync(mode);

        return transactionHistory.Profit;
    }

    public string Format(decimal balance)
        => throw new ClientSideOnlyException();

    private bool LoggedIn()
    {
        return currentUserAccessor.User.Identity?.IsAuthenticated is true;
    }
}
