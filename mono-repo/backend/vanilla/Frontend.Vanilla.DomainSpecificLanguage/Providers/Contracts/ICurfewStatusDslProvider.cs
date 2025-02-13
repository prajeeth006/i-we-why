using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the logged-on user's deposit curfew.
/// </summary>
[Description("Values related to the user's deposit curfew.")]
public interface ICurfewStatusDslProvider
{
    /// <summary>
    /// Indicates if user's deposit curfew is on. Returns false for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Indicates if user's deposit curfew is on. Returns false for anonymous user.")]
    Task<bool> GetIsDepositCurfewOnAsync(ExecutionMode mode);
}
