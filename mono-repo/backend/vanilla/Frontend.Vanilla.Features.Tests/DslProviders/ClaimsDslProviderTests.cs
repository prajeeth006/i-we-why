using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class ClaimsDslProviderTests
{
    private IClaimsDslProvider target;
    private ICurrentUserAccessor currentUserAccessor;

    public ClaimsDslProviderTests()
    {
        currentUserAccessor = Mock.Of<ICurrentUserAccessor>(a => a.User == new ClaimsPrincipal());
        target = new ClaimsDslProvider(currentUserAccessor);
    }

    [Theory]
    [InlineData("country")]
    [InlineData("Country")]
    [InlineData("http://bwin.com/claims/country")]
    [InlineData("http://bwin.com/claims/COUNTRY")]
    public void ShallGetClaim(string claimType)
    {
        currentUserAccessor.User.AddIdentity(new ClaimsIdentity(new[] { new Claim("http://bwin.com/claims/country", "Austria") }));
        target.Get(claimType).Should().Be("Austria");
    }

    [Fact]
    public void ShallReturnEmptyString_IfClaimNotExist()
        => target.Get("http://bwin.com/claims/country").Should().BeNull();
}
