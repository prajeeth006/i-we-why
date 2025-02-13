#nullable disable
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IRegistrationDslProvider" />.
/// </summary>
internal sealed class RegistrationDslProvider(
    ICurrentUserAccessor currentUserAccessor,
    IPosApiAccountServiceInternal posApiAccountService,
    IClock clock)
    : IRegistrationDslProvider
{
    public Task<string> GetDateAsync(ExecutionMode mode)
        => ConvertRegistrationTime(mode,
            convert: (regTime, _) => regTime.ToString(RegistrationDslProviderConstants.RegistrationDateFormat),
            anonymousValue: string.Empty);

    // Note: we compare dates without time so register at 23:59, at 00:01 it's already 1 day
    public Task<decimal> GetDaysRegisteredAsync(ExecutionMode mode)
        => ConvertRegistrationTime(mode,
            convert: (regTime, user) => (clock.UtcNow.ToUserLocalTime(user).Date - regTime.Date).Days,
            anonymousValue: -1m);

    private async Task<T> ConvertRegistrationTime<T>(ExecutionMode mode, Func<DateTimeOffset, ClaimsPrincipal, T> convert, T anonymousValue)
    {
        var user = currentUserAccessor.User;

        if (!user.IsAuthenticatedOrHasWorkflow())
            return anonymousValue;

        var regTime = await posApiAccountService.GetRegistrationDateAsync(mode);

        return convert(regTime.ToUserLocalTime(user), user);
    }
}
