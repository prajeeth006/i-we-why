using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides activity and transaction properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides activity and transaction properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.")]
public interface IUserSummaryDslProvider
{
    /// <summary>User's net profit.</summary>
    [Description("User's net profit.")]
    Task<decimal> GetNetProfitAsync(ExecutionMode mode);

    /// <summary>User's net loss.</summary>
    [Description("User's net loss.")]
    Task<decimal> GetNetLossAsync(ExecutionMode mode);

    /// <summary>User's tax collected for poker game play.</summary>
    [Description("User's tax collected for poker game play.")]
    Task<decimal> GetPokerTaxCollectedAsync(ExecutionMode mode);

    /// <summary>User's tax collected for casino game play.</summary>
    [Description("User's tax collected for casino game play.")]
    Task<decimal> GetCasinoTaxCollectedAsync(ExecutionMode mode);

    /// <summary>User's tax collected for sports game play.</summary>
    [Description("User's tax collected for sports game play.")]
    Task<decimal> GetSportsTaxCollectedAsync(ExecutionMode mode);

    /// <summary>User's total deposit amount.</summary>
    [Description("User's total deposit amount.")]
    Task<decimal> GetTotalDepositAmountAsync(ExecutionMode mode);

    /// <summary>User's total withdrawal amount.</summary>
    [Description("User's total withdrawal amount.")]
    Task<decimal> GetTotalWithdrawalAmountAsync(ExecutionMode mode);

    /// <summary>User's loss amount.</summary>
    [Description("User's loss amount.")]
    Task<decimal> GetLossAsync(ExecutionMode mode);

    /// <summary>User's profit amount.</summary>
    [Description("User's profit amount.")]
    Task<decimal> GetProfitAsync(ExecutionMode mode);

    /// <summary>Formats specified summary value according to configuration <c>https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Web.UI&amp;key=CurrencyDisplay</c>.</summary>
    [ClientSideOnly]
    [Description(
        "Formats specified summary value according to configuration https://admin.dynacon.prod.env.works/goto?feature=VanillaFramework.Web.UI&key=CurrencyDisplay.")]
    string Format(decimal value);
}
