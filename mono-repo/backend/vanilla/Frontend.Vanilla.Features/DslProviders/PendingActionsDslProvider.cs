using System.Linq;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class PendingActionsDslProvider(IPosApiAuthenticationService authService, ICurrentUserAccessor currentUserAccessor) : IPendingActionsDslProvider
{
    public bool HasActionWithReactionNeeded()
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return false;

        var pendingActions = authService.GetPendingActions();

        return pendingActions.Actions.Any(a => a.ReactionNeeded);
    }
}
