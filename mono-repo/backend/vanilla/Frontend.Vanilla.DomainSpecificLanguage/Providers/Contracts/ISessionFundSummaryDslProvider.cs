using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides session fund summary properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides session fund summary properties of authenticated user obtained from PosAPI service. Values are truncated integers and they are negative in case of anonymous user.")]
public interface ISessionFundSummaryDslProvider
{
    /// <summary>User's loss amount.</summary>
    [Description("Session fund loss amount.")]
    Task<decimal> GetLossAsync(ExecutionMode mode);

    /// <summary>Session fund profit amount.</summary>
    [Description("Session fund profit amount.")]
    Task<decimal> GetProfitAsync(ExecutionMode mode);

    /// <summary>Session fund total stake amount.</summary>
    [Description("Session fund total stake amount.")]
    Task<decimal> GetTotalStakeAsync(ExecutionMode mode);

    /// <summary>Session fund current balance amount.</summary>
    [Description("Session fund current balance amount.")]
    Task<decimal> GetCurrentBalanceAsync(ExecutionMode mode);

    /// <summary>Session fund initial balance amount.</summary>
    [Description("Session fund initial balance amount.")]
    Task<decimal> GetInitialBalanceAsync(ExecutionMode mode);
}
