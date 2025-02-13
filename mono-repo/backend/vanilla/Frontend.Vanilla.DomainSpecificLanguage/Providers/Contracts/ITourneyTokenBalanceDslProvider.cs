using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides Tourney Token Balance properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides tourney token balance properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.")]
public interface ITourneyTokenBalanceDslProvider
{
    /// <summary>User's tourney token balance amount.</summary>
    [Description("Tourney Token balance amount.")]
    Task<decimal> GetBalanceAsync(ExecutionMode mode);

    /// <summary>User's tourney token currency.</summary>
    [Description("Tourney Token currency.")]
    Task<string> GetCurrencyAsync(ExecutionMode mode);
}
