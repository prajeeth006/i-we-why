using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides authentication options.
/// </summary>
[Description("Provides authentication options.")]
public interface IAuthenticationDslProvider
{
    /// <summary>
    /// Performs logout.
    /// </summary>
    [Description("Performs logout.")]
    [ValueVolatility(ValueVolatility.Client)]
    [SkipInitialValueGetOnDslPage]
    Task LogoutAsync(ExecutionMode mode);
}
