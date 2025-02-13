using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class BalanceDslProvider(IBalanceDslExecutor executor) : IBalanceDslProvider
{
    public Task<decimal> GetAccountBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.AccountBalance);

    public Task<decimal> GetPayPalBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PayPalBalance);

    public Task<decimal> GetPayPalRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PayPalRestrictedBalance);

    public Task<decimal> GetPayPalCashoutableBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PayPalCashoutableBalance);

    public Task<decimal> GetAvailableBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.AvailableBalance);

    public Task<decimal> GetInPlayAmountAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.InPlayAmount);

    public Task<decimal> GetOwedAmountAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.OwedAmount);

    public Task<decimal> GetCashoutableBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CashoutableBalance);

    public Task<decimal> GetCashoutableBalanceAtOnlineAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CashoutableBalanceAtOnline);

    public Task<decimal> GetCashoutableBalanceAtRetailAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CashoutableBalanceAtRetail);

    public Task<decimal> GetCashoutableBalanceRealAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CashoutableBalanceReal);

    public Task<decimal> GetCashoutRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CashoutRestrictedBalance);

    public Task<decimal> GetCashoutRestrictedCashBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CashoutRestrictedCashBalance);

    public Task<decimal> GetPlayMoneyBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PlayMoneyBalance);

    public Task<decimal> GetPlayMoneyInPlayAmountAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PlayMoneyInPlayAmount);

    public Task<decimal> GetPokerWinningsRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PokerWinningsRestrictedBalance);

    public Task<decimal> GetTaxWithheldAmountAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.TaxWithheldAmount);

    public Task<decimal> GetDepositRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.DepositRestrictedBalance);

    public Task<decimal> GetReleaseRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.ReleaseRestrictedBalance);

    public Task<decimal> GetCreditCardDepositBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CreditCardDepositBalance);

    public Task<decimal> GetCreditCardWinningsBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.CreditCardWinningsBalance);

    public Task<decimal> GetDebitCardDepositBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.DebitCardDepositBalance);

    public Task<decimal> GetUncollectedFundsAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.UncollectedFunds);

    public Task<decimal> GetMainRealBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.MainRealBalance);

    public Task<decimal> GetBalanceForGameTypeAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.BalanceForGameType);

    public Task<decimal> GetBonusWinningsRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.BonusWinningsRestrictedBalance);

    public Task<decimal> GetSportsExclusiveBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.SportsExclusiveBalance);

    public Task<decimal> GetSportsDepositBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.SportsDepositBalance);

    public Task<decimal> GetGamesDepositBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.GamesDepositBalance);

    public Task<decimal> GetSportsWinningsBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.SportsWinningsBalance);

    public Task<decimal> GetPokerWinningsBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PokerWinningsBalance);

    public Task<decimal> GetSlotsWinningsBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.SlotsWinningsBalance);

    public Task<decimal> GetSportsRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.SportsRestrictedBalance);

    public Task<decimal> GetPokerRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PokerRestrictedBalance);

    public Task<decimal> GetSlotsRestrictedBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.SlotsRestrictedBalance);

    public Task<decimal> GetAllWinningsBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.AllWinningsBalance);

    public Task<decimal> GetMaxLimitExceededBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.MaxLimitExceededBalance);

    public Task<decimal> GetPrepaidCardDepositBalanceAsync(ExecutionMode mode)
        => executor.GetAsync(mode, b => b.PrepaidCardDepositBalance);

    public bool IsLow(decimal balance)
        => throw new ClientSideOnlyException();

    public string Format(decimal balance)
        => throw new ClientSideOnlyException();
}
