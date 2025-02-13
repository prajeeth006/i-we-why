using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides offer information.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides offer information.")]
public interface IOfferDslProvider
{
    /// <summary>
    /// Get offer status.
    /// </summary>
    [Description("Gets offer status.")]
    Task<string> GetStatusAsync(ExecutionMode mode, string type, string id);

    /// <summary>
    /// Indicates if the status of the specified event is 'Offered'.
    /// </summary>
    [Description("Indicates if the status of the specified event is 'Offered'.")]
    Task<bool> IsOfferedAsync(ExecutionMode mode, string type, string id);
}
