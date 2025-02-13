using System;
using System.Security.Claims;
using System.Security.Principal;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security;

public class ClaimsUserCasterTests
{
    [Fact]
    public void ShouldCastAsClaimsPrincpal()
    {
        IPrincipal user = new ClaimsPrincipal();

        var result = ClaimsUserCaster.Cast(user, "source"); // Act

        result.Should().BeSameAs(user);
    }

    [Theory, BooleanData]
    public void ShouldThrow_IfNotClaimsPrincipal(bool isAuthenticated)
    {
        var user = Mock.Of<IPrincipal>(
            p =>
                p.Identity.IsAuthenticated == isAuthenticated
                && p.Identity.Name == "Chuck Norris"
                && p.Identity.AuthenticationType == "auth type");

        Action act = () => ClaimsUserCaster.Cast(user, "source");

        act.Should().Throw<InvalidCastException>()
            .Which.Message.Should().StartWith(
                $"Vanilla requires {typeof(ClaimsPrincipal)} but current user IsAuthenticated = {isAuthenticated}, Name = 'Chuck Norris', AuthenticationType = 'auth type'"
                + $" in source is {user.GetType()}. Vanilla sets the user to correct type ASAP when processing HTTP request. Investigate who/when/why changes the user in source."
                + " Called from: ")
            .And.Contain(nameof(ClaimsUserCasterTests)).And.Contain(nameof(ShouldThrow_IfNotClaimsPrincipal));
    }

    [Fact]
    public void ShouldHandleNullIdentity()
    {
        var user = Mock.Of<IPrincipal>();

        Action act = () => ClaimsUserCaster.Cast(user, "source");

        act.Should().Throw<InvalidCastException>().Which.Message.Should().Contain("(null identity)");
    }

    [Fact]
    public void ShouldThrow_IfNullPrincipal()
    {
        Action act = () => ClaimsUserCaster.Cast(null, "source");

        act.Should().Throw().WithMessage("User in source is null.");
    }
}
