using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.MyBets;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class BettingStatusDslProvider(IPosApiMyBetsService posApiMyBetsService, ICurrentUserAccessor currentUserAccessor) : IBettingStatusDslProvider
{
    private const bool AnonymousValue = false;

    public async Task<bool> UserHasBets(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return AnonymousValue;
        }

        var hasBets = await posApiMyBetsService.GetAsync(mode.AsyncCancellationToken ?? CancellationToken.None);

        return hasBets;
    }
}
