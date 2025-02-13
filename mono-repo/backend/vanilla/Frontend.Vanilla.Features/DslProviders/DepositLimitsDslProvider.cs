using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class DepositLimitsDslProvider(ICurrentUserAccessor currentUserAccessor, IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal)
    : IDepositLimitsDslProvider
{
    private const decimal AnonymousValue = -1;

    public async Task<decimal> GetAsync(ExecutionMode mode, string limitType)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return AnonymousValue;

        var limits = await posApiResponsibleGamingServiceInternal.GetDepositLimitsAsync(mode);
        var currentLimit = limits.FirstOrDefault(l => l.LimitSet && l.Type.Equals(limitType, StringComparison.OrdinalIgnoreCase))?.CurrentLimit ?? AnonymousValue;

        return currentLimit;
    }

    public bool IsLow(string limitType)
        => throw new ClientSideOnlyException();
}
