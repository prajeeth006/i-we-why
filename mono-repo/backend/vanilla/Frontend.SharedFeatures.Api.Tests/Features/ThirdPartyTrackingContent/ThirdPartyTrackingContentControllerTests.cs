using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.ThirdPartyTrackingContent;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.ServiceClients.Services.Crm.TrackerUrl;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.ThirdPartyTrackingContent;

public class ThirdPartyTrackingContentControllerTests
{
    private readonly ThirdPartyTrackingContentController controller;
    private readonly Mock<ITrackerUrlServiceClient> trackerUrlServiceClient;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly TestLogger<ThirdPartyTrackingContentController> log;
    private readonly CancellationToken ct;

    public ThirdPartyTrackingContentControllerTests()
    {
        trackerUrlServiceClient = new Mock<ITrackerUrlServiceClient>();
        cookieHandler = new Mock<ICookieHandler>();
        log = new TestLogger<ThirdPartyTrackingContentController>();
        controller = new ThirdPartyTrackingContentController(trackerUrlServiceClient.Object, cookieHandler.Object, log);
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public async Task ShouldReturnEmptyOkResponseWhenAffiliateTrackingCookieNotExists()
    {
        var result = await controller.Get(ct, "chid", "pid");

        result.Should().BeAssignableTo<OkObjectResult>();
    }

    [Theory]
    [InlineData("")]
    [InlineData("invalidTrackerId")]
    [InlineData(null)]
    public async Task ShouldReturnEmptyOkResponseWhenAffiliateTrackingCookieContainsInvalidTrackerId(string? trackerId)
    {
        cookieHandler.Setup(h => h.GetValue(CookieConstants.TrackingAffiliate)).Returns(trackerId);

        var result = await controller.Get(ct, "chid", "pid"); // Act

        result.Should().BeOfType<OkObjectResult>();
        trackerUrlServiceClient.VerifyWithAnyArgs(c => c.GetAsync(default, null, null, null, null), Times.Never);
    }

    [Fact]
    public async Task ShouldReturnEmptyOkResponseWhenCrmServiceReturnsNoTrackerUrl()
    {
        cookieHandler.Setup(h => h.GetValue(CookieConstants.TrackingAffiliate)).Returns("123");

        var result = await controller.Get(ct, "chid", "pid"); // Act

        result.Should().BeAssignableTo<OkObjectResult>();
        trackerUrlServiceClient.Verify(c => c.GetAsync(ExecutionMode.Async(ct), 123, null, "chid", "pid"));
    }

    [Fact]
    public async Task ShouldReturnTrackerUrlWhenAllCookiesContainCorrectValues()
    {
        cookieHandler.Setup(h => h.GetValue(CookieConstants.TrackingAffiliate)).Returns("123");
        cookieHandler.Setup(h => h.GetValue(CookieConstants.Tdpeh)).Returns("tduid");
        trackerUrlServiceClient.Setup(s => s.GetAsync(ExecutionMode.Async(ct), 123, "tduid", "chid", "pid")).ReturnsAsync("<img />");

        var result = (OkObjectResult)await controller.Get(ct, "chid", "pid"); // Act
        ((string?)((dynamic?)result.Value)?.content).Should().Be("<img />");
    }

    [Fact]
    public async Task ShouldReturnNotFoundWhenCrmServiceThrows()
    {
        var posApiError = new Exception("PosAPI error.");
        trackerUrlServiceClient.Setup(s => s.GetAsync(ExecutionMode.Async(ct), 123, "tduid", "chid", "pid")).ThrowsAsync(posApiError);
        cookieHandler.Setup(h => h.GetValue(CookieConstants.TrackingAffiliate)).Returns("123");
        cookieHandler.Setup(h => h.GetValue(CookieConstants.Tdpeh)).Returns("tduid");

        var result = await controller.Get(ct, "chid", "pid"); // Act

        result.Should().BeAssignableTo<NotFoundResult>();
        log.Logged.Single().Verify(LogLevel.Error, posApiError, ("trackerId", "123"), ("tdUid", "tduid"), ("channelId", "chid"), ("productId", "pid"));
    }
}
