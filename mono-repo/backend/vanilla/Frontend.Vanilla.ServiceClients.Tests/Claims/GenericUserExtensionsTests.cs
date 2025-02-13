using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Claims;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Claims;

public class GenericUserExtensionsTests
{
    [Theory]
    [InlineData("claim-1", "value-1")]
    [InlineData("claim-2", "value-2.1")]
    [InlineData("claim-3", "")]
    [InlineData("claim-4", null)]
    public void FindValue_ShouldGetClaimValue(string claimType, string expectedValue)
    {
        var user = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim("claim-1", "value-1"),
                    new Claim("claim-2", "value-2.1"),
                    new Claim("claim-2", "value-2.2"),
                    new Claim("claim-3", ""),
                }));

        var result = user.FindValue(claimType); // Act

        result.Should().Be(expectedValue);
    }
}
