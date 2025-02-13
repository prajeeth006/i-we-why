using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides bonus abuser information.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides bonus abuser information.")]
public interface IBonusAbuserInformationDslProvider
{
    /// <summary>
    /// Indicates if the user is bonus abuser.
    /// </summary>
    [Description("Indicates if the user is bonus abuser.")]
    Task<bool> GetIsBonusAbuserAsync(ExecutionMode mode);
}
