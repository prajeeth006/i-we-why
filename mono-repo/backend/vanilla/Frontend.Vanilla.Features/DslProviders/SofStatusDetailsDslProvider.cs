using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class SofStatusDetailsDslProvider(IPosApiAccountServiceInternal posApiAccountServiceInternal, ICurrentUserAccessor currentUserAccessor)
    : ISofStatusDetailsDslProvider
{
    public async Task<string> GetSofStatusAsync(ExecutionMode mode)
        => await GetProperty<string>(mode, (status) => status.SofStatus);

    public async Task<decimal> GetRedStatusDaysAsync(ExecutionMode mode)
        => await GetProperty<decimal>(mode, (status) => status.RedStatusDays);

    private async Task<T> GetProperty<T>(ExecutionMode mode, Func<SofStatusDetails, T> getValue)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            var defaultMohDetails = new SofStatusDetails();

            return getValue(defaultMohDetails);
        }

        var sofStatusDetails = await posApiAccountServiceInternal.GetSofStatusDetailsAsync(mode);

        return getValue(sofStatusDetails);
    }
}
