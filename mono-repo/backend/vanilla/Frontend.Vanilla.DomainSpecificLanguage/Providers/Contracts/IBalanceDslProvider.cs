using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides balance properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides balance properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.")]
public interface IBalanceDslProvider
{
    /// <summary>The account balance.</summary>
    [Description("The account balance.")]
    Task<decimal> GetAccountBalanceAsync(ExecutionMode mode);

    /// <summary>The PayPal balance.</summary>
    [Description("The PayPal balance.")]
    Task<decimal> GetPayPalBalanceAsync(ExecutionMode mode);

    /// <summary>The PayPal restricted balance.</summary>
    [Description("The PayPal restricted balance.")]
    Task<decimal> GetPayPalRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The PayPal cashoutable balance.</summary>
    [Description("The PayPal cashoutable balance.")]
    Task<decimal> GetPayPalCashoutableBalanceAsync(ExecutionMode mode);

    /// <summary>The available balance.</summary>
    [Description("The available balance.")]
    Task<decimal> GetAvailableBalanceAsync(ExecutionMode mode);

    /// <summary>The in play amount.</summary>
    [Description("The in play amount.")]
    Task<decimal> GetInPlayAmountAsync(ExecutionMode mode);

    /// <summary>The owed amout.</summary>
    [Description("The owed amount.")]
    Task<decimal> GetOwedAmountAsync(ExecutionMode mode);

    /// <summary>The cashoutable balance.</summary>
    [Description("The cashoutable balance.")]
    Task<decimal> GetCashoutableBalanceAsync(ExecutionMode mode);

    /// <summary>The deposit restricted balance.</summary>
    [Description("The deposit restricted balance.")]
    Task<decimal> GetDepositRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The cashoutable balance at online.</summary>
    [Description("The cashoutable balance at online.")]
    Task<decimal> GetCashoutableBalanceAtOnlineAsync(ExecutionMode mode);

    /// <summary>The release restricted balance.</summary>
    [Description("The release restricted balance.")]
    Task<decimal> GetReleaseRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The cashoutable balance at retail.</summary>
    [Description("The cashoutable balance at retail.")]
    Task<decimal> GetCashoutableBalanceAtRetailAsync(ExecutionMode mode);

    /// <summary>The cashoutable balance real.</summary>
    [Description("The cashoutable balance real.")]
    Task<decimal> GetCashoutableBalanceRealAsync(ExecutionMode mode);

    /// <summary>The cashout restricted balance.</summary>
    [Description("The cashout restricted balance.")]
    Task<decimal> GetCashoutRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The cashout restricted cash balance real.</summary>
    [Description("The cashout restricted cash balance.")]
    Task<decimal> GetCashoutRestrictedCashBalanceAsync(ExecutionMode mode);

    /// <summary>The play money balance.</summary>
    [Description("The play money balance.")]
    Task<decimal> GetPlayMoneyBalanceAsync(ExecutionMode mode);

    /// <summary>The play money in play amount.</summary>
    [Description("The play money in play amount.")]
    Task<decimal> GetPlayMoneyInPlayAmountAsync(ExecutionMode mode);

    /// <summary>The credit card winnings balance.</summary>
    [Description("The credit card deposit balance.")]
    Task<decimal> GetCreditCardDepositBalanceAsync(ExecutionMode mode);

    /// <summary>The poker winnings restricted balance.</summary>
    [Description("The poker winnings restricted balance.")]
    Task<decimal> GetPokerWinningsRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The credit card winnings balance.</summary>
    [Description("The credit card winnings balance.")]
    Task<decimal> GetCreditCardWinningsBalanceAsync(ExecutionMode mode);

    /// <summary>The balance for game type.</summary>
    [Description("The balance for game type.")]
    Task<decimal> GetBalanceForGameTypeAsync(ExecutionMode mode);

    /// <summary>The bonus winnings restricted balance.</summary>
    [Description("The bonus winnings restricted balance.")]
    Task<decimal> GetBonusWinningsRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The tax withheld amount.</summary>
    [Description("The tax withheld amount.")]
    Task<decimal> GetTaxWithheldAmountAsync(ExecutionMode mode);

    /// <summary>The debit catrd deposit balance.</summary>
    [Description("The debit catrd deposit balance.")]
    Task<decimal> GetDebitCardDepositBalanceAsync(ExecutionMode mode);

    /// <summary>The uncollected funds.</summary>
    [Description("The uncollected funds.")]
    Task<decimal> GetUncollectedFundsAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("The main real balance.")]
    Task<decimal> GetMainRealBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description(
        "Deposit for Sportsbook with payment method PayPal and VISA. As per the payment method rules these funds and winnings from these funds should be restricted to sports only.")]
    Task<decimal> GetSportsExclusiveBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description(
        "Deposit for Sportsbook with a payment method other than PayPal and VISA. Winnings from this funds will be captured in Sports Winning’s bucket and can be used in all products post 60 min.")]
    Task<decimal> GetSportsDepositBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description(
        "Deposit for Slots and Poker. Winnings from these funds will be captured in Slots Winnings bucket or Poker Winning’s bucket and can be used in other product post 60 min.")]
    Task<decimal> GetGamesDepositBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description(
        "Winning from sports bets which are placed with SportsDepositBalance and these funds will be restricted to only for SportsBook till 60 min, post that these funds will be released to AllWinningsBalance.")]
    Task<decimal> GetSportsWinningsBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Winning from Poker and these funds will be restricted to only for Poker till 60 min, post that these funds will be release to AllWinningsBalance.")]
    Task<decimal> GetPokerWinningsBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Winning from Slots and these funds will be restricted to only for Slots till 60 min, post that these funds will be release to AllWinningsBalance.")]
    Task<decimal> GetSlotsWinningsBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Restricted Sports net winnings.")]
    Task<decimal> GetSportsRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Restricted Poker net winnings.")]
    Task<decimal> GetPokerRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Restricted Slotsnet winnings.")]
    Task<decimal> GetSlotsRestrictedBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Winnings from all products post 60 min restriction which can be used across all products.")]
    Task<decimal> GetAllWinningsBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Exceeding the max. credit.")]
    Task<decimal> GetMaxLimitExceededBalanceAsync(ExecutionMode mode);

    /// <summary>The main real balance.</summary>
    [Description("Prepaid card deposit.")]
    Task<decimal> GetPrepaidCardDepositBalanceAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if specified balance is low according to the configuration <c>https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Features.Balance&amp;key=LowThresholds</c>.
    /// Example use: Balance.IsLow(Balance.AccountBalance).
    /// </summary>
    [ClientSideOnly]
    [Description(
        "Indicates if specified balance is low according to the configuration https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Features.Balance&key=LowThresholds."
        + " Example use: Balance.IsLow(Balance.AccountBalance).")]
    bool IsLow(decimal balance);

    /// <summary>Formats specified balance according to configuration <c>https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Web.UI&amp;key=CurrencyDisplay</c>.</summary>
    [ClientSideOnly]
    [Description("Formats specified balance according to configuration https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Web.UI&key=CurrencyDisplay.")]
    string Format(decimal balance);
}
