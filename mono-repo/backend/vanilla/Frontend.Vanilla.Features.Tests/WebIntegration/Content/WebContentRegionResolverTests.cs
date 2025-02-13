using System.Globalization;
using System.Security.Claims;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.WebIntegration.Content;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Content;

public class WebContentRegionResolverTests
{
    private IContentRegionResolver target;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private ClaimsPrincipal user;

    public WebContentRegionResolverTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim(PosApiClaimTypes.Address.CountryId, "AT") }));
        currentUserAccessor.SetupGet(a => a.User).Returns(user);

        target = new WebContentRegionResolver(currentUserAccessor.Object);
    }

    [Fact]
    public void GetCurrentLanguageCode_ShouldReturnCultureTwoLetterCode()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("de-AT"));
        target.GetCurrentLanguageCode().Should().Be("de");
    }

    [Fact]
    public void GetUserCountryCode_ShouldReturnUsersCountry()
    {
        target.GetUserCountryCode().Should().Be("AT");
    }
}
