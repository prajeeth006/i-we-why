using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>Provides access to user's Sof details.</summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides access to user's Sof details.")]
public interface ISofStatusDetailsDslProvider
{
    /// <summary>
    /// Indicates user's sof status.
    /// </summary>
    [Description("Indicates user's sof status.")]
    Task<string> GetSofStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's red status days.
    /// </summary>
    [Description("Indicates user's red status days.")]
    Task<decimal> GetRedStatusDaysAsync(ExecutionMode mode);
}
