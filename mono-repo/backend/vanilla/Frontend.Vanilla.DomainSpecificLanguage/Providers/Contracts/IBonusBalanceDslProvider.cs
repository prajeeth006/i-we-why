using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides bonus balance properties of authenticated user obtained from PosAPI service. Values are 0 in case of anonymous user or bonus not found for product.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description(
    "Provides bonus balance per product of authenticated user obtained from PosAPI service. Values are 0 in case of anonymous user or bonus not found for product.")]
public interface IBonusBalanceDslProvider
{
    /// <summary>Gets the bonus balance for the specified product.</summary>
    [Description("Gets the bonus balance for the specified product.")]
    Task<decimal> GetAsync(ExecutionMode mode, string product);

    /// <summary>Gets the bonus balance for the specific bonus type.</summary>
    [Description("Gets the bonus balance for the specific bonus type.")]
    Task<decimal> GetBonusByTypeAsync(ExecutionMode mode, string bonusType);
}
