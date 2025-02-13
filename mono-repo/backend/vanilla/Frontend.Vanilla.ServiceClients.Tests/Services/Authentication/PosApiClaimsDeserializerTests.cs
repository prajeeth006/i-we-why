using System;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class PosApiClaimsDeserializerTests
{
    private IPosApiClaimsDeserializer target;
    private ClaimsResponse response;

    public PosApiClaimsDeserializerTests()
    {
        target = new PosApiClaimsDeserializer();
        response = new ClaimsResponse
        {
            ClaimValues =
            {
                { "Claim 1", "Value 1" },
                { "Claim 2", null },
            },
        };
    }

    [Fact]
    public void ShouldResolveAllClaims()
    {
        var claims = target.Deserialize(response, authTokens: null); // Act

        claims.Should().MatchItems(
            c => c.Type == "Claim 1" && c.Value == "Value 1" && c.Issuer == PosApiClaimsDeserializer.PosApiIssuer,
            c => c.Type == "Claim 2" && c.Value == "" && c.Issuer == PosApiClaimsDeserializer.PosApiIssuer);
    }

    [Fact]
    public void ShouldIncludeAuthClaims_IfAuthTokensProvided()
    {
        var claims = target.Deserialize(response, new PosApiAuthTokens("user-token", "session-token")); // Act

        claims.Should().HaveCount(4)
            .And.Contain(c => c.Type == PosApiClaimTypes.UserToken && c.Value == "user-token" && c.Issuer == PosApiClaimsDeserializer.VanillaIssuer)
            .And.Contain(c => c.Type == PosApiClaimTypes.SessionToken && c.Value == "session-token" && c.Issuer == PosApiClaimsDeserializer.VanillaIssuer);
    }

    [Theory]
    [InlineData(PosApiClaimTypes.UserToken)]
    [InlineData(PosApiClaimTypes.SessionToken)]
    public void ShouldThrow_IfVanillaClaimsIssuedByPosApi(string claimType)
        => RunFailedTest(
            claimType,
            expectedExceptionMsg: "Claim types http://api.bwin.com/v3/user/usertoken, http://api.bwin.com/v3/user/sessiontoken"
                                  + " are supposed to be issued exclusively by Vanilla but PosAPI response contains some of them:"
                                  + @" {""Claim 1"":""Value 1"",""Claim 2"":null,""" + claimType + @""":""whatever""}.");

    [Theory, ValuesData("", "  ", " Not Trimmed")]
    public void ShouldThrow_IfInvalidClaimType(string claimType)
        => RunFailedTest(
            claimType,
            expectedExceptionMsg: $"Claim type must be a trimmed non-empty string but there is '{claimType}'='whatever' which came from PosAPI.");

    private void RunFailedTest(string claimType, string expectedExceptionMsg)
    {
        response.ClaimValues.Add(claimType, "whatever");

        Action act = () => target.Deserialize(response, null);

        act.Should().Throw().WithMessage(expectedExceptionMsg);
    }
}
