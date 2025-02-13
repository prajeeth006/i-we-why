using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the user's connected accounts.
/// </summary>
[Description("Values related to the user's connected accounts.")]
public interface IConnectedAccountsDslProvider
{
    /// <summary>
    /// Determines if user has any associated accounts. Returns false for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Determines if user has any associated accounts. Returns 0 for anonymous user.")]
    Task<decimal> GetCountAsync(ExecutionMode mode);
}
