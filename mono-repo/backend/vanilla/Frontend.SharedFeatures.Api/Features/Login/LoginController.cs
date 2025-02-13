using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.ReCaptcha;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Login;

[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class LoginController : BaseController
{
    private readonly IReCaptchaService reCaptchaService;
    private readonly ILoginResultHandlerInternal loginResultHandler;
    private readonly IDeviceFingerprintEnricher deviceFingerprintEnricher;
    private readonly ICookieHandler cookieHandler;

    internal LoginController(
        ILoginResultHandlerInternal loginResultHandler,
        IReCaptchaService reCaptchaService,
        IDeviceFingerprintEnricher deviceFingerprintEnricher,
        ICookieHandler cookieHandler)
    {
        this.loginResultHandler = loginResultHandler;
        this.reCaptchaService = reCaptchaService;
        this.deviceFingerprintEnricher = deviceFingerprintEnricher;
        this.cookieHandler = cookieHandler;
    }

    public LoginController(IServiceProvider c)
        : this(
            c.GetRequiredService<ILoginResultHandlerInternal>(),
            c.GetRequiredService<IReCaptchaService>(),
            c.GetRequiredService<IDeviceFingerprintEnricher>(),
            c.GetRequiredService<ICookieHandler>()) { }

    [BypassAntiForgeryToken]
    [HttpPost]
    public async Task<IActionResult> Post(LoginRequest request, CancellationToken cancellationToken)
    {
        return await loginResultHandler.HandleAsync(loginService => LoginAction(loginService, request, cancellationToken), cancellationToken);
    }

    internal async Task<LoginInfo> LoginAction(ILoginService loginService, LoginRequest request, CancellationToken cancellationToken)
    {
        var isConnectCard = LoginType.ConnectCard.Equals(request.LoginType, StringComparison.OrdinalIgnoreCase);
        var userName = isConnectCard ? request.ConnectCardNumber : request.Username;

        if (!await reCaptchaService.VerifyUsersResponseAsync(
                "Login",
                request.CaptchaResponse,
                new Dictionary<string, object>
                {
                    { "userName", userName ?? string.Empty },
                },
                cancellationToken))
        {
            return new LoginInfo
            {
                Status = LoginStatus.Error,
                ErrorMessage = await reCaptchaService.GetVersionedVerificationMessageAsync(ReCaptchaVersion.Enterprise, cancellationToken),
                ErrorCode = "reCaptcha",
            };
        }

        var parameters = new MobileLoginParameters
        {
            DateOfBirth = request.DateOfBirth,
            Username = userName,
            Email = request.Username,
            SsoToken = request.SsoToken,
            Password = isConnectCard ? request.Pin : request.Password,
            Fingerprint = request.Fingerprint,
            LoginType = request.LoginType?.ToLower(),
            RememberMe = request.RememberMe,
            ProductId = request.ProductId,
            Pid = request.Pid,
            AuthorizationCode = request.AuthorizationCode,
            OAuthProvider = request.OAuthProvider,
            OAuthUserId = request.OAuthUserId,
            RequestData = request.RequestData,
            TerminalId = request.LoginType == LoginType.ConnectCard ? cookieHandler.GetValue(CookieConstants.TerminalId) : null,
            ShopId = request.LoginType == LoginType.ConnectCard ? cookieHandler.GetValue(CookieConstants.ShopId) : null,
        };

        await deviceFingerprintEnricher.EnrichAsync(parameters.Fingerprint, ExecutionMode.Async(cancellationToken));

        return await loginService.Login(parameters, cancellationToken);
    }
}
