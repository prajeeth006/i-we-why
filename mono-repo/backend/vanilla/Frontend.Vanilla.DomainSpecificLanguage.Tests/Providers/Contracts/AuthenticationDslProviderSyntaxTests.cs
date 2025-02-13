using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class AuthenticationDslProviderSyntaxTests : SyntaxTestBase<IAuthenticationDslProvider>
{
    [Fact]
    public void Logout_Test()
    {
        Execute("Authentication.Logout()");
        Provider.Verify(p => p.LogoutAsync(Mode));
    }
}
