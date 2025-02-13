using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IReferredFriendsDslProvider" />.
/// </summary>
internal sealed class ReferredFriendsDslProvider(
    ICurrentUserAccessor currentUserAccessor,
    IPosApiCrmServiceInternal posApiCrmServiceInternal)
    : IReferredFriendsDslProvider
{
    public async Task<string> GetInvitationUrlAsync(ExecutionMode mode)
    {
        if (!currentUserAccessor.User.Identity?.IsAuthenticated is true)
        {
            return string.Empty;
        }

        var invitationUrl = await posApiCrmServiceInternal.GetInvitationUrlAsync(mode);

        return invitationUrl.Url ?? string.Empty;
    }
}
