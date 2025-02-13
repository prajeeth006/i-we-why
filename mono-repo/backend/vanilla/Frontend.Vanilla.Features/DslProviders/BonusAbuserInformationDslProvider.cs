using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class BonusAbuserInformationDslProvider(IPosApiAccountServiceInternal posApiAccountService, ICurrentUserAccessor currentUserAccessor)
    : IBonusAbuserInformationDslProvider
{
    private const bool AnonymousValue = false;

    public async Task<bool> GetIsBonusAbuserAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return AnonymousValue;
        }

        var abuserInformation = await posApiAccountService.GetDnaAbuserInformationAsync(mode);

        return abuserInformation.IsBonusAbuser;
    }
}
