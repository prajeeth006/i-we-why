using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Promohub;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IBonusAwardDslProvider" />.
/// </summary>
internal sealed class BonusAwardDslProvider(IPosApiPromohubServiceInternal posApiPromohubService, ICurrentUserAccessor currentUserAccessor)
    : IBonusAwardDslProvider
{
    public async Task<bool> IsBonusAwarded(ExecutionMode mode, string offerId)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn() || string.IsNullOrEmpty(offerId))
        {
            return false;
        }

        var result = await posApiPromohubService.GetBonusAwardAsync(mode, offerId);

        return result.IssuedBonus.DirectAward;
    }
}
