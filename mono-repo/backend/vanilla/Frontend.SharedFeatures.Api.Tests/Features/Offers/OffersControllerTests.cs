using System.Security.Claims;
using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Offers;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Offers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Offers;

public class OffersControllerTests
{
    private readonly OffersController target;
    private readonly Mock<IPosApiNotificationService> posApiNotificationService;
    private readonly Mock<IPosApiOffersServiceClient> posApiOffersService;
    private readonly TestLogger<OffersController> logMock;
    private readonly Mock<ClaimsPrincipal> user;
    private readonly CancellationToken ct;

    public OffersControllerTests()
    {
        posApiNotificationService = new Mock<IPosApiNotificationService>();
        posApiOffersService = new Mock<IPosApiOffersServiceClient>();
        logMock = new TestLogger<OffersController>();
        user = new Mock<ClaimsPrincipal>();
        user.SetupGet(u => u.Identity!.IsAuthenticated).Returns(true);
        target = new OffersController(posApiOffersService.Object, logMock, posApiNotificationService.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = user.Object,
                },
            },
        };
        ct = TestCancellationToken.Get();
    }

    [Fact]
    public async Task ShouldGetCount()
    {
        var bonusOffers = new List<PosApiKeyValuePair>
        {
            new ()
            {
                Key = "bonuses",
                Value = 5,
            },
        };
        posApiOffersService.Setup(s => s.GetCountAsync(ct, "POST_LOGIN_COUNTER")).ReturnsAsync(bonusOffers);

        var result = (OkObjectResult)await target.GetCount(ct); // Act

        result.Value.Should().BeEquivalentTo(new { offers = bonusOffers });
    }

    [Fact]
    public async Task ShouldGetOfferEventStatusOnGet()
    {
        posApiNotificationService.Setup(s => s.GetOfferStatusAsync("test", "event123", ct)).ReturnsAsync("foo");

        var result = (OkObjectResult)await target.GetAsync("test", "event123", ct); // Act

        result.Value.Should().BeEquivalentTo(new { Status = "foo" });
    }

    [Fact]
    public async Task ShouldGetUnauthorizedForAnonymousUserOnGet()
    {
        user.SetupGet(u => u.Identity!.IsAuthenticated).Returns(false);
        var result = await target.GetAsync("test", "event123", ct); // Act

        result.Should().BeOfType<UnauthorizedResult>();
        posApiNotificationService.VerifyWithAnyArgs(s => s.GetOfferStatusAsync(null, null, TestContext.Current.CancellationToken), Times.Never);
    }

    [Fact]
    public async Task ShouldUpdateOfferEventStatusOnPost()
    {
        posApiNotificationService.SetupWithAnyArgs(s => s.UpdateOfferStatusAsync(null, null, default, TestContext.Current.CancellationToken, null)).ReturnsAsync("foo");

        var result = (OkObjectResult)await target.PostAsync("test", "event123", true, ct); // Act

        result.Value.Should().BeEquivalentTo(new { Status = "foo" });
        posApiNotificationService.Verify(s => s.UpdateOfferStatusAsync("test", "event123", true, ct, null));
    }
}
