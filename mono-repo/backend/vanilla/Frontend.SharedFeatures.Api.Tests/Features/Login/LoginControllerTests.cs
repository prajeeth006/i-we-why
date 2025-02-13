using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Login;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using LoginResponse = Frontend.Vanilla.Features.Login.LoginResponse;

namespace Frontend.SharedFeatures.Api.Tests.Features.Login;

public class LoginControllerTests
{
    private readonly LoginController target;
    private readonly LoginRequest loginRequest;
    private readonly Mock<IReCaptchaService> reCaptchaServiceMock;
    private readonly Mock<ILoginService> loginHelperServiceMock;
    private readonly Mock<ILoginResultHandlerInternal> loginResultHandlerMock;
    private readonly Mock<IDeviceFingerprintEnricher> deviceFingerprintEnricher;

    // private readonly Mock<ILoginSettingsConfiguration> loginSettingsConfiguration;
    // private readonly Mock<IMobilePhoneLoginService> mobilePhoneLoginService;
    private readonly Mock<ICookieHandler> cookieHandler;

    public LoginControllerTests()
    {
        reCaptchaServiceMock = new Mock<IReCaptchaService>();
        loginHelperServiceMock = new Mock<ILoginService>();
        loginResultHandlerMock = new Mock<ILoginResultHandlerInternal>();
        // loginSettingsConfiguration = new Mock<ILoginSettingsConfiguration>();
        // mobilePhoneLoginService = new Mock<IMobilePhoneLoginService>();
        cookieHandler = new Mock<ICookieHandler>();

        loginRequest = new LoginRequest
        {
            Username = "user123",
            Password = "123123",
            Fingerprint = new DeviceFingerprint(),
            ProductId = "SPORTS",
            RequestData = new Dictionary<string, string> { ["foo"] = "bar" },
        };

        deviceFingerprintEnricher = new Mock<IDeviceFingerprintEnricher>();

        target = new LoginController(
            loginResultHandlerMock.Object,
            reCaptchaServiceMock.Object,
            deviceFingerprintEnricher.Object,
            cookieHandler.Object);
    }

    [Fact]
    public async Task Get_Succeeds_WhenAuthenticationSuccessful()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = true,
            }));

        var result = (OkObjectResult)await target.Post(loginRequest, It.IsAny<CancellationToken>());

        result.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task Get_Succeeds_WhenUserIsFromAnotherLabel()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = true,
            }));

        var result = (OkObjectResult)await target.Post(loginRequest, It.IsAny<CancellationToken>());

        result.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task Get_ReturnsError_WhenLoginFails()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BadRequestResult().WithErrorMessage("login not possible"));

        var result = (MessageResult)await target.Post(loginRequest, It.IsAny<CancellationToken>());

        result.Messages[0].Content.Should().Be("login not possible");
    }

    [Fact]
    public async Task Get_ReturnsWorkflowResponse_WhenUnresolvedWorkflow()
    {
        const string workflowUrl = "workflow/url";
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new OkObjectResult(new LoginResponse()
            {
                IsCompleted = false,
                RedirectUrl = workflowUrl,
            }));

        var result = (OkObjectResult)await target.Post(loginRequest, It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo(new { RedirectUrl = workflowUrl });
    }

    [Fact]
    public async Task Get_ReturnsError_WhenUnknownStatus()
    {
        loginResultHandlerMock.Setup(f => f.HandleAsync(It.IsAny<Func<ILoginService, Task<LoginInfo>>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new BadRequestObjectResult(new { errorCode = "0" }));

        var result = (BadRequestObjectResult)await target.Post(loginRequest, It.IsAny<CancellationToken>());

        result.Value.Should().BeEquivalentTo(new { errorCode = "0" });
    }

    [Fact]
    public async Task LoginAction_ShouldReturnError_IfRecaptchaFails()
    {
        object? userName = null;

        reCaptchaServiceMock.Setup(o => o.VerifyUsersResponseAsync(
                "Login",
                null,
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<CancellationToken>()))
            .Callback((
                TrimmedRequiredString area,
                string? usersResponse,
                Dictionary<string, object> additionalParameters,
                CancellationToken cancellationToken) =>
            {
                additionalParameters.TryGetValue("userName", out userName);
            })
            .Returns(Task.FromResult(false));

        reCaptchaServiceMock.Setup(o => o.GetVersionedVerificationMessageAsync(ReCaptchaVersion.Enterprise, It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult((RequiredString)"Recaptcha failed."));

        var result = await target.LoginAction(loginHelperServiceMock.Object, loginRequest, It.IsAny<CancellationToken>());

        result.Should().NotBeNull();
        result.ErrorMessage.Should().BeEquivalentTo("Recaptcha failed.");
        userName.Should().Be(loginRequest.Username);
    }

    [Fact]
    public async Task LoginAction_Succeeds_WhenAuthenticationSuccessful()
    {
        object? userName = null;

        reCaptchaServiceMock.Setup(o => o.VerifyUsersResponseAsync(
                "Login",
                null,
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<CancellationToken>()))
            .Callback((
                TrimmedRequiredString area,
                string? usersResponse,
                Dictionary<string, object> additionalParameters,
                CancellationToken cancellationToken) =>
            {
                additionalParameters?.TryGetValue("userName", out userName);
            })
            .Returns(Task.FromResult(true));

        loginHelperServiceMock.Setup(f => f.Login(It.IsAny<MobileLoginParameters>(), It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(new LoginInfo
            {
                Status = LoginStatus.Success,
                PostLoginRedirect = new KeyValuePair<string, PostLoginRedirect>("bla", new PostLoginRedirect
                {
                    Options = new PostLoginRedirectOptions(),
                }),
            }));

        var result = await target.LoginAction(loginHelperServiceMock.Object, loginRequest, It.IsAny<CancellationToken>());

        result.Should().NotBeNull();
        result.Status.Should().Be(LoginStatus.Success);
        userName.Should().Be(loginRequest.Username);
    }

    [Fact]
    public async Task LoginAction_Sucess_WhenLoginTypeIsCardConnectAndHasTerminalIDAndShopiIDCookie()
    {
        object? userName = null;

        cookieHandler.Setup(f => f.GetValue(CookieConstants.TerminalId)).Returns("2");
        cookieHandler.Setup(f => f.GetValue(CookieConstants.ShopId)).Returns("4");
        loginRequest.LoginType = LoginType.ConnectCard;

        reCaptchaServiceMock.Setup(o => o.VerifyUsersResponseAsync(
                "Login",
                null,
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<CancellationToken>()))
            .Callback((
                TrimmedRequiredString area,
                string? usersResponse,
                Dictionary<string, object> additionalParameters,
                CancellationToken cancellationToken) =>
            {
                additionalParameters?.TryGetValue("userName", out userName);
            })
            .Returns(Task.FromResult(true));

        var result = await target.LoginAction(loginHelperServiceMock.Object, loginRequest, It.IsAny<CancellationToken>());

        loginHelperServiceMock.Verify(f =>
            f.Login(It.Is<MobileLoginParameters>(p => p.ShopId == "4" && p.TerminalId == "2"), It.IsAny<CancellationToken>()));
    }
}
