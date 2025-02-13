using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class AuthenticationDslProviderTests
{
    private readonly IAuthenticationDslProvider target;
    private readonly Mock<IWebAuthenticationService> webAuthenticationService;

    private readonly ExecutionMode mode;

    public AuthenticationDslProviderTests()
    {
        webAuthenticationService = new Mock<IWebAuthenticationService>();
        target = new AuthenticationDslProvider(webAuthenticationService.Object);

        mode = TestExecutionMode.Get();
    }

    [Fact]
    public async Task LogoutAsync()
    {
        // Act
        await target.LogoutAsync(mode);

        webAuthenticationService.Verify(c => c.LogoutAsync(mode));
    }
}
