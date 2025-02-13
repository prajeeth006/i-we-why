using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims;

public class GlobalClaimInfosTests
{
    [Fact]
    public void ShouldCollectInfosFromVanillaKnownClaims()
    {
        var target = new GlobalClaimInfos();

        target.Infos.Count.Should().BeGreaterThan(10);
        target.Infos.Each(i => i.Should().NotBeNull());

        // Test Vanilla claim
        var sessionToken = target.Infos.Single(i => i.Type == PosApiClaimTypes.SessionToken);
        sessionToken.Description.Should().Be("Unique token to identify the user’s session on the backend.");
        sessionToken.Issuer.Should().Be(PosApiClaimsDeserializer.VanillaIssuer);

        // Test PosAPI claim
        var homePhone = target.Infos.Single(i => i.Type == PosApiClaimTypes.Phone.Home.Number);
        homePhone.Description.Should().Be("Number of home phone that user has specified in the settings/registration e.g. '9878998789'.");
        homePhone.Issuer.Should().Be(PosApiClaimsDeserializer.PosApiIssuer);
    }
}
