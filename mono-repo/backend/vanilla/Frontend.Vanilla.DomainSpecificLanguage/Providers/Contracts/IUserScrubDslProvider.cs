using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the user's scrubbed status.
/// </summary>
[Description("Values related to the user's scrubbed status.")]
public interface IUserScrubDslProvider
{
    /// <summary>
    /// Determines whether user is scrubbed for product. If user is not authenticated returns false.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Determines whether user is scrubbed for product. If user is not authenticated returns false.")]
    Task<bool> IsScrubbedForAsync(ExecutionMode mode, string product);
}
