using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.SingleSignOn;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.SingleSignOn;

public class SingleSignOnControllerTest
{
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<ICookieHandler> cookieHandler;
    private readonly CancellationToken ct;
    private readonly TestLogger<SingleSignOnController> log;
    private readonly SingleSignOnController target;

    public SingleSignOnControllerTest()
    {
        ct = new CancellationTokenSource().Token;
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        cookieHandler = new Mock<ICookieHandler>();
        log = new TestLogger<SingleSignOnController>();
        target = new SingleSignOnController(currentUserAccessor.Object, cookieHandler.Object, log);
    }

    [Theory]
    [InlineData(AuthState.Anonymous, true)]
    [InlineData(AuthState.Workflow, false)]
    [InlineData(AuthState.Authenticated, false)]
    public void SetSsoToken_ShouldReturnOK(AuthState authState, bool expected)
    {
        currentUserAccessor.SetupGet(a => a.User).Returns(TestUser.Get(authState));

        var response = target.SetSsoToken(new SsoTokenRequest("token"));

        response.Should().BeOfType<OkObjectResult>();
        cookieHandler.Verify(o => o.Set(CookieConstants.SsoTokenCrossDomain, "token", It.IsAny<CookieSetOptions>()), expected ? Times.Once() : Times.Never());
    }

    [Fact]
    public void SetSsoToken_ShouldReturnError_OnException()
    {
        cookieHandler.Setup(o => o.Set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CookieSetOptions>())).Throws(new Exception());

        var response = target.SetSsoToken(new SsoTokenRequest("token"));

        response.GetOriginalResult<BadRequestObjectResult>().Should().NotBeNull();
    }
}
