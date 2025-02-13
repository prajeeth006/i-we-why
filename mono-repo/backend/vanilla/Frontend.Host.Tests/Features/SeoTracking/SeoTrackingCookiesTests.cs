using FluentAssertions;
using Frontend.Host.Features.SeoTracking;
using Frontend.Vanilla.Features.Cookies;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.SeoTracking;

public sealed class SeoTrackingCookiesTests
{
    private ISeoTrackingCookies target;
    private Mock<ICookieHandler> cookieHandler;

    public SeoTrackingCookiesTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        var config = new SeoTrackingConfiguration { WmidCookieName = "wmid", LandingUrlCookieName = "landing-url" };
        target = new SeoTrackingCookies(cookieHandler.Object, config);
    }

    [Fact]
    public void GetWmidTest()
    {
        cookieHandler.Setup(h => h.GetValue("wmid")).Returns("666");
        target.GetWmid().Should().Be("666");
    }

    [Fact]
    public void SetWmidTest()
    {
        target.SetWmid("666");
        cookieHandler.Verify(h => h.Set("wmid", "666", new CookieSetOptions { MaxAge = TimeSpan.FromDays(30) }));
    }

    [Fact]
    public void SetLandingUrlTest()
    {
        target.SetLandingUrl(new Uri("https://www.bwin.com/en/page"));
        cookieHandler.Verify(h => h.Set("landing-url", "https://www.bwin.com/en/page", new CookieSetOptions { MaxAge = TimeSpan.FromDays(30) }));
    }
}
