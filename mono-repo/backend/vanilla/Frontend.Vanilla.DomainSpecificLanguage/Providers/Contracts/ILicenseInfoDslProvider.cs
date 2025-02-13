using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to user's license compliance info.
/// </summary>
[Description("Provides access to user's license info.")]
[ValueVolatility(ValueVolatility.Client)]
public interface ILicenseInfoDslProvider
{
    /// <summary>
    /// Indicates if user needs to accept any licenses on current product.
    /// </summary>
    /// <returns></returns>
    [Description("Indicates if user needs to accept any licenses on current product.")]
    Task<bool> GetAcceptanceNeededAsync(ExecutionMode mode);
}
