using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.DynaConVariationContext.Providers;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DynaConVariationContext.Providers;

public class UserAgentDynaConProviderTests : DynaConProviderTestsBase
{
    private readonly Mock<IHttpContextAccessor> httpContextAccessorMock;
    private readonly Mock<IDeviceAtlasService> deviceAtlasService;

    public UserAgentDynaConProviderTests()
    {
        httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        deviceAtlasService = new Mock<IDeviceAtlasService>();
        Target = new UserAgentDynaConProvider(httpContextAccessorMock.Object, deviceAtlasService.Object);
    }

    [Theory]
    [InlineData(null, UserAgentTypes.Other)]
    [InlineData("", UserAgentTypes.Other)]
    [InlineData("SCOM", UserAgentTypes.Scom)]
    [InlineData("Mozilla/5.0 (Windows NT 6.3; Win64; x64; Catchpoint) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
        UserAgentTypes.Catchpoint)]
    [InlineData("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", UserAgentTypes.Robot, "1")]
    [InlineData(
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Google-InspectionTool/1.0)",
        UserAgentTypes.Robot,
        "1")]
    [InlineData(
        "Mozilla/5.0 (Linux; Android 9.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Mobile Safari/537.36 Frontend-Automation",
        UserAgentTypes.FrontendAutomation)]
    [InlineData(
        "Mozilla/5.0+(X11;+Linux+x86_64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+HeadlessChrome/89.0.4389.82+Safari/537.36+Prerender+(+https://github.com/prerender/prerender)",
        UserAgentTypes.Prerender)]
    [InlineData(
        "Mozilla/5.0 (Linux; Android 11; Pixel 2 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) Prerender (+https://github.com/prerender/prerender)",
        UserAgentTypes.Prerender)]
    [InlineData("Mozilla/5.0+(X11;+Linux+x86_64)+AppleWebKit/537.36+(KHTML,+like+Gecko)+HeadlessChrome/89.0.4389.82+Safari/537.36", UserAgentTypes.Other)]
    [InlineData("Mozilla/5.0 (Linux; Android 8.1.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 PTST/230405.214311",
        UserAgentTypes.WebPageTest)]
    public void GetCurrentRawValue_ShouldMapCorrectly(string userAgent, string expected, string robot = "0")
    {
        httpContextAccessorMock.SetupGet(p => p.HttpContext.Request.Headers[HttpHeaders.UserAgent]).Returns(userAgent);
        deviceAtlasService.Setup(p => p.Get()).Returns((true, new Dictionary<string, string> { ["isRobot"] = robot }));

        Target.GetCurrentRawValue().Should().Be(expected);
    }
}
