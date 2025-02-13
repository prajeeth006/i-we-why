using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides the deposit limits for the user.
/// </summary>
[Description("Provides the deposit limits for the user.")]
public interface IPlayerLimitsDslProvider
{
    /// <summary>
    /// Get player limits sum by limit type IDs.
    /// </summary>
    [Description("Get player limits sum by limit type IDs.")]
    [ValueVolatility(ValueVolatility.Client)]
    [ClientSideOnly]
    Task<decimal> GetPlayerLimitsSumAsync(ExecutionMode mode, string limitTypeIds);
}
