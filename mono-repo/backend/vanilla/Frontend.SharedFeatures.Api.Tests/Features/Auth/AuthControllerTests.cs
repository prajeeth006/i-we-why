using System.Security.Claims;
using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Auth;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Auth;

public class AuthControllerTests
{
    private readonly AuthController controller;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<IWebAuthenticationService> authenticationService;
    private readonly Mock<ILoginExpirationProvider> loginExpirationProvider;
    private readonly Mock<IPosApiAuthenticationService> posApiAuthenticationService;
    private readonly IClock clock;
    private readonly TestLogger<AuthController> log;
    private readonly CancellationToken ct;
    private readonly Mock<IDateTimeCultureBasedFormatter> dateTimeCultureBasedFormatter;

    public AuthControllerTests()
    {
        ct = TestCancellationToken.Get();
        log = new TestLogger<AuthController>();
        authenticationService = new Mock<IWebAuthenticationService>();
        loginExpirationProvider = new Mock<ILoginExpirationProvider>();
        posApiAuthenticationService = new Mock<IPosApiAuthenticationService>();
        dateTimeCultureBasedFormatter = new Mock<IDateTimeCultureBasedFormatter>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        clock = new TestClock();

        controller = new AuthController(
            authenticationService.Object,
            loginExpirationProvider.Object,
            currentUserAccessor.Object,
            posApiAuthenticationService.Object,
            clock,
            log,
            dateTimeCultureBasedFormatter.Object);
    }

    [Fact]
    public async Task Logout_ShouldLogoutUser()
    {
        var result = await controller.Logout(ct);
        result.Should().BeOfType<OkObjectResult>();

        authenticationService.Verify(s => s.LogoutAsync(ExecutionMode.Async(ct)), Times.Once);
    }

    [Theory]
    [InlineData(AuthState.Anonymous, false)]
    [InlineData(AuthState.Workflow, true)]
    [InlineData(AuthState.Authenticated, true)]
    public void Check_ShouldReturnWhetherTheUserIsAuthenticated(AuthState authState, bool expected)
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(TestUser.Get(authState));

        var result = (OkObjectResult)controller.Check();
        var response = (dynamic)result.Value!;
        ((bool)response.isAuthenticated).Should().Be(expected);
    }

    [Fact]
    public async Task Duration_ShouldWork()
    {
        loginExpirationProvider.Setup(a => a.GetRemainingTimeAndLoginDurationInMillisecondsAsync(ct)).ReturnsAsync((0, 1000 * 61 * 121));

        var result = (OkObjectResult)await controller.Duration(ct);
        var response = (dynamic)result.Value!;
        ((string)response.duration).Should().Be("02:03:01");
    }

    [Fact]
    public async Task LoginStartTime_ShouldWork()
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(TestUser.Get(AuthState.Authenticated));
        var startTime = new UtcDateTime(2020, 3, 15);
        posApiAuthenticationService.Setup(a => a.GetCurrentSessionAsync(ct)).ReturnsAsync(new CurrentSession(startTime));
        dateTimeCultureBasedFormatter.Setup(x => x.Format(It.IsAny<DateTime>(), It.IsAny<string>())).Returns("3/15/2020 5:00 AM");
        var result = (OkObjectResult)await controller.LoginStartTime(ct);
        var response = (dynamic)result.Value!;
        ((string)response.startTime).Should().Be("3/15/2020 5:00 AM");
    }

    [Fact]
    public void SessionTimeLeft_ShouldWork()
    {
        var authProps = new AuthenticationProperties
        {
            IssuedUtc = clock.UtcNow.AddSeconds(-50).ValueWithOffset,
            ExpiresUtc = clock.UtcNow.AddSeconds(130).ValueWithOffset,
        };
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(), authProps, "");
        var context = new DefaultHttpContext();
        var feature = new Mock<IAuthenticateResultFeature>();
        feature.SetupGet(f => f.AuthenticateResult).Returns(AuthenticateResult.Success(ticket));
        context.Features.Set(feature.Object);
        controller.ControllerContext = new ControllerContext { HttpContext = context };
        var result = (OkObjectResult)controller.SessionTimeLeft();
        var response = (dynamic)result.Value!;

        ((decimal)response.timeLeftInMiliseconds).Should().Be(130000M);
    }
}
