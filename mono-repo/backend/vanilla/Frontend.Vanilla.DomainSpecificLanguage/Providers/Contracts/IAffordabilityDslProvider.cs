using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides information about the customer affordability.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides access to affordability settings.")]
public interface IAffordabilityDslProvider
{
    /// <summary>
    /// Indicates the affordability level. LEVEL1 .. LEVEL6 = (1 .. 6), OTHER = 0.
    /// Returns empty string for non-real money players.
    /// </summary>
    /// <returns>Affordability level as string (e.g. "2").</returns>
    [Description("Gets the affordability level. LEVEL1 .. LEVEL6 = (1 .. 6), OTHER = 0.")]
    Task<string> LevelAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates the employment group of the customer.
    /// Returns empty string for non-real money players.
    /// </summary>
    /// <returns>Employment group (e.g. "employed").</returns>
    [Description("Gets the employment group of the customer.")]
    Task<string> EmploymentGroupAsync(ExecutionMode mode);
}
