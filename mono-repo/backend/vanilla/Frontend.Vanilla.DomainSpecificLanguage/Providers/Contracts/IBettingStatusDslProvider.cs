using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides betting properties of authenticated user obtained from BPOS service.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides betting properties of authenticated user obtained from BPOS service.")]
public interface IBettingStatusDslProvider
{
    /// <summary>The account balance.</summary>
    [Description("Indicates if user has bets.")]
    Task<bool> UserHasBets(ExecutionMode mode);
}
