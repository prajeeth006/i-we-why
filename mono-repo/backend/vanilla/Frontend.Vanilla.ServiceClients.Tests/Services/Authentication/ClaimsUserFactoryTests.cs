using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class ClaimsUserFactoryTests
{
    private IClaimsUserFactory target;
    private List<Claim> claims;

    public ClaimsUserFactoryTests()
    {
        target = new ClaimsUserFactory();
        claims = new List<Claim>
        {
            new Claim(PosApiClaimTypes.Name, "Chuck Norris"),
            new Claim(PosApiClaimTypes.CurrencyId, "gold"),
        };
    }

    [Theory, ValuesData(null, "0")]
    public void ShouldReturnFullyAuthenticatedUser_IfHasPosApiAuthTokensAndNoWorkflow(string workflowTypeId)
    {
        SetupAuthClaims();
        if (workflowTypeId != null) claims.Add(new Claim(PosApiClaimTypes.WorkflowTypeId, workflowTypeId)); // Should be ignored

        RunAndExpectUser(isAuthenticated: true, authType: "Vanilla");
    }

    [Fact]
    public void ShouldReturnAnonymousUser_IfHasWorkflowTypeId()
    {
        SetupAuthClaims();
        claims.Add(new Claim(PosApiClaimTypes.WorkflowTypeId, "666"));

        RunAndExpectUser(isAuthenticated: false, authType: null);
    }

    [Theory, ValuesData(null, "0", "666")]
    public void ShouldReturnAnonymousUser_IfNoPosApiAuthTokens(string workflowTypeId)
    {
        if (workflowTypeId != null) claims.Add(new Claim(PosApiClaimTypes.WorkflowTypeId, workflowTypeId)); // Should be ignored

        RunAndExpectUser(isAuthenticated: false, authType: null);
    }

    private void RunAndExpectUser(bool isAuthenticated, string authType)
    {
        var user = target.Create(claims); // Act

        user.Claims.Select(c => (c.Type, c.Value)).Should().Equal(claims.Select(c => (c.Type, c.Value))); // B/c claims are cloned and Subject is set
        user.Identity.Should().BeAssignableTo<ClaimsIdentity>();
        user.Identity.Name.Should().Be("Chuck Norris");
        user.Identity.IsAuthenticated.Should().Be(isAuthenticated);
        user.Identity.AuthenticationType.Should().Be(authType);
    }

    [Fact]
    public void ShouldThrow_IfInvalidAuthTokens()
    {
        SetupAuthClaims(userToken: "  ");

        RunFailedAndGetInnerException().Should().BeOfType<ArgumentException>();
    }

    [Fact]
    public void ShouldThrow_IfInvalidWorkflowtypeId()
    {
        SetupAuthClaims();
        claims.Add(new Claim(PosApiClaimTypes.WorkflowTypeId, "gibberish"));

        RunFailedAndGetInnerException().Message.Should().Be("Claim http://api.bwin.com/v3/user/workflowtype must be an integer but it is 'gibberish'.");
    }

    private Exception RunFailedAndGetInnerException()
        => new Action(() => target.Create(claims))
            .Should().Throw().WithMessage("Failed creating claims user 'Chuck Norris'.")
            .Which.InnerException;

    private void SetupAuthClaims(string userToken = "user-token", string sessionToken = "session-token")
    {
        claims.Add(new Claim(PosApiClaimTypes.UserToken, userToken));
        claims.Add(new Claim(PosApiClaimTypes.SessionToken, sessionToken));
    }
}
