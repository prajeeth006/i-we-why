using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.RememberMe;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.RememberMe;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.RememberMe;

public class RememberMeControllerTests
{
    private readonly RememberMeController target;
    private readonly Mock<IRememberMeTokenCookie> tokenCookie;
    private readonly Mock<IRememberMeTokenStorage> tokenStorage;
    private readonly Mock<ILoginResultHandlerInternal> loginResultHandler;
    private readonly Mock<IDeviceFingerprintEnricher> deviceFingerprintEnricher;
    private readonly Mock<ILoginService> loginService;
    private readonly TestLogger<RememberMeController> log;

    private readonly CancellationToken ct;
    private readonly ExecutionMode mode;
    private RememberMeLoginRequest request;
    private readonly IActionResult loginHandlerResult;
    private readonly LoginInfo loginResult;

    public RememberMeControllerTests()
    {
        tokenCookie = new Mock<IRememberMeTokenCookie>();
        tokenStorage = new Mock<IRememberMeTokenStorage>();
        loginResultHandler = new Mock<ILoginResultHandlerInternal>();
        deviceFingerprintEnricher = new Mock<IDeviceFingerprintEnricher>();
        loginService = new Mock<ILoginService>();
        log = new TestLogger<RememberMeController>();
        target = new RememberMeController(tokenCookie.Object, tokenStorage.Object, loginResultHandler.Object, deviceFingerprintEnricher.Object, log);

        ct = TestCancellationToken.Get();
        mode = ExecutionMode.Async(ct);
        request = new RememberMeLoginRequest(new DeviceFingerprint());
        loginResult = new LoginInfo { RememberMeToken = "newRMT" };
        loginHandlerResult = Mock.Of<IActionResult>();

        tokenCookie.Setup(c => c.Get()).Returns("loginRMT");
        loginService.Setup(s => s.Login(It.IsNotNull<RememberMeLoginParameters>(), ct)).ReturnsAsync(loginResult);
        loginResultHandler.Setup(h => h.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), ct))
            .Returns(async (Func<ILoginService, Task<LoginInfo>> func, CancellationToken t) =>
            {
                var loginResult = await func(loginService.Object);
                loginResult.Should().BeSameAs(this.loginResult);

                return loginHandlerResult;
            });
    }

    [Fact]
    public async Task Put_ShouldSetCookie_IfTokenAvailableInStorage()
    {
        tokenStorage.Setup(s => s.GetAsync(ct)).ReturnsAsync("storedRMT");

        // Act
        var result = await target.Put(ct);

        result.Should().BeOfType<OkObjectResult>();
        tokenCookie.Verify(c => c.Set("storedRMT"));
        tokenStorage.Verify(s => s.DeleteAsync(ct));
    }

    [Fact]
    public async Task Put_ShouldNotSetCookie_IfNoToken()
    {
        // Act
        var result = await target.Put(ct);

        result.Should().BeOfType<BadRequestObjectResult>();
        tokenStorage.Verify(s => s.GetAsync(ct));
        tokenCookie.VerifyWithAnyArgs(c => c.Set(It.IsAny<TrimmedRequiredString>()), Times.Never);
        tokenStorage.VerifyWithAnyArgs(s => s.DeleteAsync(TestContext.Current.CancellationToken), Times.Never);
    }

    [Fact]
    public async Task Post_ShouldLoginUsingCookieToken()
    {
        // Act
        var result = await target.Post(request, ct);

        result.Should().BeSameAs(loginHandlerResult);
        deviceFingerprintEnricher.Verify(e => e.EnrichAsync(request.Fingerprint, mode));
        loginService.Invocations.Single().Arguments[0].Should().BeEquivalentTo(new RememberMeLoginParameters("loginRMT") { Fingerprint = request.Fingerprint });
        tokenCookie.Verify(c => c.Set("newRMT"));
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task Post_ShouldLogAndCancelRememberMe_IfNoNewToken()
    {
        loginResult.RememberMeToken = null;
        await RunTokenErrorTest("oldToken");
    }

    [Fact]
    public async Task Post_ShouldLogAndCancelRememberMe_IfReturnedSametokenAsLoginOne()
    {
        loginResult.RememberMeToken = "loginRMT";
        await RunTokenErrorTest("token");
    }

    private async Task RunTokenErrorTest(string loggedTokenKey)
    {
        // Act
        var result = await target.Post(request, ct);

        result.Should().BeSameAs(loginHandlerResult);
        deviceFingerprintEnricher.Verify(e => e.EnrichAsync(request.Fingerprint, mode));
        tokenCookie.VerifyWithAnyArgs(c => c.Set(It.IsAny<TrimmedRequiredString>()), Times.Never);
        tokenCookie.Verify(c => c.Delete());
        log.Logged.Single().Verify(LogLevel.Error, (loggedTokenKey, "loginRMT"));
    }

    [Fact]
    public void Post_ShouldFail_IfNoToken()
    {
        tokenCookie.Setup(c => c.Get()).Returns(() => null);

        Func<Task> act = () => target.Post(request, ct);

        act.Should().ThrowAsync<InvalidOperationException>();
        tokenCookie.Verify(c => c.Delete(), Times.Never);
    }

    [Fact]
    public async Task Post_ShouldRemoveCookie_IfLoginFailed()
    {
        var ex = new Exception("Login error");
        loginResultHandler.SetupWithAnyArgs(h => h.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), TestContext.Current.CancellationToken)).Throws(ex);

        Func<Task> act = () => target.Post(request, ct);

        (await act.Should().ThrowAsync<Exception>()).Which.Should().BeSameAs(ex);
        tokenCookie.Verify(c => c.Delete());
        log.Logged.Single().Verify(LogLevel.Error, ex, ("token", "loginRMT"));
    }

    [Fact]
    public void Delete_ShouldDeleteCookie()
    {
        // Act
        var result = target.Delete();

        result.Should().BeOfType<OkObjectResult>();
        tokenCookie.Verify(c => c.Delete());
    }
}
