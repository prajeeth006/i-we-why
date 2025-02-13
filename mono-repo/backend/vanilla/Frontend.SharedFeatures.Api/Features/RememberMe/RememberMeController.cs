using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.RememberMe;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.RememberMe;

/// <summary>
/// API for handling remember-me from client.
/// </summary>
[AllowAnonymous]
[BypassAntiForgeryToken]
[Route("api/auth/[controller]")]
[ApiController]
public sealed class RememberMeController : BaseController
{
    private readonly IRememberMeTokenCookie tokenCookie;
    private readonly IRememberMeTokenStorage tokenStorage;
    private readonly ILoginResultHandlerInternal loginResultHandler;
    private readonly IDeviceFingerprintEnricher deviceFingerprintEnricher;
    private readonly ILogger log;

    internal RememberMeController(
        IRememberMeTokenCookie tokenCookie,
        IRememberMeTokenStorage tokenStorage,
        ILoginResultHandlerInternal loginResultHandler,
        IDeviceFingerprintEnricher deviceFingerprintEnricher,
        ILogger<RememberMeController> log)
    {
        this.tokenCookie = tokenCookie;
        this.tokenStorage = tokenStorage;
        this.loginResultHandler = loginResultHandler;
        this.deviceFingerprintEnricher = deviceFingerprintEnricher;
        this.log = log;
    }

    public RememberMeController(IServiceProvider c)
        : this(
            c.GetRequiredService<IRememberMeTokenCookie>(),
            c.GetRequiredService<IRememberMeTokenStorage>(),
            c.GetRequiredService<ILoginResultHandlerInternal>(),
            c.GetRequiredService<IDeviceFingerprintEnricher>(),
            c.GetRequiredService<ILogger<RememberMeController>>()) { }

    /// <summary>Set the cookie based on previous regular login.</summary>
    [HttpPut]
    public async Task<IActionResult> Put(CancellationToken cancellationToken)
    {
        var token = await tokenStorage.GetAsync(cancellationToken);

        if (token == null)
        {
            log.LogError("RememberMe: failed to get current token from Distributed cache.");
            return BadRequest("Token not found in Distributed cache");
        }

        tokenCookie.Set(token);
        await tokenStorage.DeleteAsync(cancellationToken);
        return Ok();
    }

    /// <summary>Login by the token from the cookie.</summary>
    [HttpPost]
    public async Task<IActionResult> Post(RememberMeLoginRequest request, CancellationToken cancellationToken)
    {
        var tokenToLogin = ResolveToken();
        await deviceFingerprintEnricher.EnrichAsync(request.Fingerprint, ExecutionMode.Async(cancellationToken));

        try
        {
            var parameters = new RememberMeLoginParameters(tokenToLogin) { Fingerprint = request.Fingerprint };

            return await loginResultHandler.HandleAsync(
                async loginService =>
                {
                    var loginResult = await loginService.Login(parameters, cancellationToken);

                    if (loginResult.RememberMeToken == null)
                        HandlePlatformError("didn't return a new token on login by {oldToken}");
                    else if (loginResult.RememberMeToken.Equals(tokenToLogin))
                        HandlePlatformError("returned same {token} as the one used to login");
                    else
                    {
                        tokenCookie?.Delete(); // Just to make sure old token is cleared as we saw old token sent sometimes.
                        tokenCookie?.Set(loginResult.RememberMeToken);
                    }

                    return loginResult;
                },
                cancellationToken);
        }
        catch (PosApiException ex)
        {
            HandlePlatformError("failed to login user by {token}", ex);

            return BadRequest(new { errorCode = ex.PosApiCode.ToString() }).WithErrorMessage(ex.PosApiMessage);
        }
        catch (Exception ex)
        {
            HandlePlatformError("failed to login user by {token}", ex);

            throw;
        }

        string ResolveToken()
        {
            var cookie = tokenCookie.Get();

            if (cookie == null || string.IsNullOrWhiteSpace(cookie))
                throw new InvalidOperationException("Can't login by remember-me token because respective cookie is missing.");

            return cookie;
        }

        void HandlePlatformError(string howPlatformFailed, Exception? exception = null)
        {
            howPlatformFailed += ". User will receive regular short session so his long remember-me session will be abandoned.";
#nullable disable
            log.LogRememberMePlatformError(exception, howPlatformFailed, tokenToLogin);
#nullable enable
            tokenCookie.Delete();
        }
    }

    /// <summary>Delete the cookie on logout.</summary>
    [HttpDelete]
    [AllowAnonymous]
    public IActionResult Delete()
    {
        tokenCookie.Delete();

        return Ok();
    }
}

/// <summary>
/// RememberMeLoginRequest.
/// </summary>
public sealed class RememberMeLoginRequest(DeviceFingerprint fingerprint)
{
    /// <summary>
    /// Fingerprint.
    /// </summary>
    [Required]
    public DeviceFingerprint Fingerprint { get; set; } = fingerprint;
}
