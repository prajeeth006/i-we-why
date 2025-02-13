using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;

namespace Frontend.Vanilla.Features.DslProviders;

internal class PlayerLimitsDslProvider(IPlayerLimitsServiceClient playerLimitsService, ICurrentUserAccessor currentUserAccessor)
    : IPlayerLimitsDslProvider
{
    private const decimal AnonymousValue = -1;

    public async Task<decimal> GetPlayerLimitsSumAsync(ExecutionMode mode, string limitTypeIds)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return AnonymousValue;
        }

        var playerLimits = await playerLimitsService.GetPlayerLimitsAsync(mode);
        var typeIds = limitTypeIds.IndexOf(',') > -1
            ? limitTypeIds.Split(',').Select(id => id.Trim())
            : new[] { limitTypeIds };

        var limitsSum = playerLimits?.Limits
            .Where(limit => typeIds.Contains(limit.LimitType))
            .Sum(limit => limit.CurrentLimit);

        return limitsSum ?? 0;
    }
}
