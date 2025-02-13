using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the user's scrubbed status.
/// </summary>
[Description("Values related to the user's referral program.")]
public interface IReferredFriendsDslProvider
{
    /// <summary>
    /// Gets invitation for referral URL. If user is not authenticated returns empty string.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Gets invitation URL. If user is not authenticated returns empty string.")]
    Task<string> GetInvitationUrlAsync(ExecutionMode mode);
}
