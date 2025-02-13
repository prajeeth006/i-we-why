using System;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security;

public class PosApiAuthUserExtensionsTests
{
    private ClaimsPrincipal user;

    public PosApiAuthUserExtensionsTests()
    {
        var claims = new[] { new Claim(ClaimTypes.Name, "Chuck Norris") };
        user = new ClaimsPrincipal(new ClaimsIdentity(claims, "MyAuth"));
    }

    [Fact]
    public void GetPosApiTokensIfAuthenticated_ShouldReturnNull_IfAnonymous()
        => user.GetPosApiAuthTokens().Should().BeNull();

    [Fact]
    public void GetPosApiTokensIfAuthenticated_ShouldReturnTokens_IfAuthenticated()
        => RunGetTokensTest(() => user.GetPosApiAuthTokens());

    [Fact]
    public void GetPosApiTokensIfAuthenticated_ShouldThrow_IfInvalidTokens()
        => RunInvalidTokensTest(() => user.GetPosApiAuthTokens());

    [Fact]
    public void GetRequiredPosApiAuthTokens_ShouldReturnTokens_IfAuthenticated()
        => RunGetTokensTest(() => user.GetRequiredPosApiAuthTokens());

    [Fact]
    public void GetRequiredPosApiAuthTokens_ShouldThrow_IfInvalidTokens()
        => RunInvalidTokensTest(() => user.GetRequiredPosApiAuthTokens());

    [Fact]
    public void GetRequiredPosApiAuthTokens_ShouldThrow_IfAnonymous()
        => new Action(() => user.GetRequiredPosApiAuthTokens())
            .Should().Throw<NotAuthenticatedWithPosApiException>()
            .WithMessage("User must be authenticated with PosAPI hence have user and session token claims but he doesn't."
                         + " Either don't call particular operation or this is erroneous state. User: "
                         + $"{typeof(ClaimsPrincipal)} IsAuthenticated=True, Name='Chuck Norris', AuthenticationType='MyAuth'.");

    private void RunGetTokensTest(Func<PosApiAuthTokens> act)
    {
        user.AddIdentity(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(PosApiClaimTypes.UserToken, "user-token"),
                    new Claim(PosApiClaimTypes.SessionToken, "session-token"),
                }));

        var tokens = act(); // Act

        tokens.UserToken.Should().Be("user-token");
        tokens.SessionToken.Should().Be("session-token");
    }

    private void RunInvalidTokensTest(Action act)
    {
        user.AddIdentity(new ClaimsIdentity(new[] { new Claim(PosApiClaimTypes.UserToken, "") }));

        act.Should().Throw<NotAuthenticatedWithPosApiException>()
            .WithMessage(
                $"Failed to determine PosAPI tokens for the user {typeof(ClaimsPrincipal)} IsAuthenticated=True, Name='Chuck Norris', AuthenticationType='MyAuth'.")
            .Which.InnerException.Should().BeOfType<ArgumentException>();
    }
}
