using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Authentication;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IAuthenticationDslProvider" />.
/// </summary>
internal sealed class AuthenticationDslProvider(IWebAuthenticationService webAuthenticationService) : IAuthenticationDslProvider
{
    public Task LogoutAsync(ExecutionMode mode)
        => webAuthenticationService.LogoutAsync(mode);
}
