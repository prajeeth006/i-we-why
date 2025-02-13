using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.TrackerId;

public class TrackerIdResolverTests
{
    private ITrackerIdResolver target;
    private Mock<ITrackerIdQueryParameter> queryParameter;
    private Mock<ICookieHandler> cookieHandler;
    private Mock<ICookieJsonHandler> cookieJsonHandler;
    private Mock<ICurrentUserAccessor> currentUserAccessor;

    public TrackerIdResolverTests()
    {
        queryParameter = new Mock<ITrackerIdQueryParameter>();
        cookieHandler = new Mock<ICookieHandler>();
        cookieJsonHandler = new Mock<ICookieJsonHandler>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        target = new TrackerIdResolver(queryParameter.Object, cookieHandler.Object, cookieJsonHandler.Object, currentUserAccessor.Object);
    }

    [Theory, BooleanData]
    public void ShouldGetValueFromQueryString(bool includeCookie)
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);
        queryParameter.Setup(p => p.GetValue()).Returns("qq");

        // Act
        var result = target.Resolve(includeCookie);

        result.Should().Be("qq");
        cookieHandler.VerifyWithAnyArgs(h => h.GetValue(null), Times.Never);
    }

    [Theory]
    [InlineData("cc", "cc")]
    [InlineData("", null)]
    [InlineData("  ", null)]
    public void ShouldFallbackToCookie(string cookieValue, string expected)
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);
        cookieHandler.Setup(h => h.GetValue(TrackerIdResolver.CookieName)).Returns(cookieValue);

        // Act
        var result = target.Resolve(includeCookie: true);

        result.Should().Be(expected != null ? new TrimmedRequiredString(expected) : null);
    }

    [Fact]
    public void ShouldFallbackToCookie_IfExcludedByParameter()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);
        // Act
        var result = target.Resolve(includeCookie: false);

        result.Should().BeNull();
        cookieHandler.VerifyWithAnyArgs(h => h.GetValue(null), Times.Never);
    }

    [Fact]
    public void ShouldReturnUserAffiliateInfo_IfUserLoggedIn()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(true);
        cookieJsonHandler.Setup(x => x.GetValue("mobileLogin.PostLoginValues", "webmasterId")).Returns("100");
        // Act
        var result = target.Resolve(includeCookie: false);

        result.Should().Be("100");
        cookieJsonHandler.VerifyWithAnyArgs(h => h.GetValue("mobileLogin.PostLoginValues", "WebmasterId"), Times.Once);
    }

    [Fact]
    public void ShouldReturnTrackerId_IfUserIsNotLoggedIn()
    {
        currentUserAccessor.SetupGet(u => u.User.Identity.IsAuthenticated).Returns(false);
        cookieHandler.Setup(h => h.GetValue(TrackerIdResolver.CookieName)).Returns("1");
        // Act
        var result = target.Resolve(includeCookie: true);

        result.Should().Be("1");
        cookieHandler.VerifyWithAnyArgs(h => h.GetValue(null), Times.Once);
    }
}
