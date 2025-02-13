using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides bonus award information.
/// </summary>
[Description("Provides bonus award information")]
[ValueVolatility(ValueVolatility.Client)]
public interface IBonusAwardDslProvider
{
    /// <summary>
    /// Indicates if the status of the specified event is 'Offered'.
    /// </summary>
    [Description("Indicates if the status bonus awarded.")]
    Task<bool> IsBonusAwarded(ExecutionMode mode, string offerId);
}
