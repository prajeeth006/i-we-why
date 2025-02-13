using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.CookieBanner;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.CookieBanner;

public class CookieBannerControllerTest
{
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly CancellationToken ct;
    private readonly TestLogger<CookieBannerController> log;
    private readonly CookieBannerController target;

    public CookieBannerControllerTest()
    {
        ct = new CancellationTokenSource().Token;
        cookieHandler = new Mock<ICookieHandler>();
        log = new TestLogger<CookieBannerController>();
        target = new CookieBannerController(cookieHandler.Object, log);
    }

    [Theory]
    [InlineData(true)]
    public void SetOptanonGroupCookie_ShouldReturnOK(bool expected)
    {
        var response = target.SetOptanonGroupCookie(new CookieBannerRequest("groups"));

        response.Should().BeOfType<OkObjectResult>();
        cookieHandler.Verify(o => o.Set(CookieConstants.OptanonGroups, "groups", It.IsAny<CookieSetOptions>()), expected ? Times.Once() : Times.Never());
    }

    [Fact]
    public void SetOptanonGroupCookie_ShouldReturnError_OnException()
    {
        cookieHandler.Setup(o => o.Set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CookieSetOptions>())).Throws(new Exception());

        var response = target.SetOptanonGroupCookie(new CookieBannerRequest("groups"));

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
