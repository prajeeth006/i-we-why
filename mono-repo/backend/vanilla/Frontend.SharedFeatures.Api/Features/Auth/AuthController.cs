using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.LoginDuration;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Auth;

[Route("{culture}/api/[controller]")]
[ApiController]
[BypassAntiForgeryToken]
public sealed class AuthController : BaseController
{
    private readonly ILogger log;
    private readonly IWebAuthenticationService authenticationService;
    private readonly ILoginExpirationProvider loginExpirationProvider;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly IClock clock;
    private readonly IPosApiAuthenticationService posApiAuthenticationService;
    private readonly IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter;

    public AuthController(IServiceProvider c)
        : this(c.GetRequiredService<IWebAuthenticationService>(),
            c.GetRequiredService<ILoginExpirationProvider>(),
            c.GetRequiredService<ICurrentUserAccessor>(),
            c.GetRequiredService<IPosApiAuthenticationService>(),
            c.GetRequiredService<IClock>(),
            c.GetRequiredService<ILogger<AuthController>>(),
            c.GetRequiredService<IDateTimeCultureBasedFormatter>()) { }

    internal AuthController(IWebAuthenticationService authenticationService,
        ILoginExpirationProvider loginExpirationProvider,
        ICurrentUserAccessor currentUserAccessor,
        IPosApiAuthenticationService posApiAuthenticationService,
        IClock clock,
        ILogger<AuthController> log,
        IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
    {
        Guard.NotNull(authenticationService, nameof(authenticationService));
        Guard.NotNull(log, nameof(log));

        this.authenticationService = authenticationService;
        this.loginExpirationProvider = loginExpirationProvider;
        this.currentUserAccessor = currentUserAccessor;
        this.posApiAuthenticationService = posApiAuthenticationService;
        this.clock = clock;
        this.log = log;
        this.dateTimeCultureBasedFormatter = dateTimeCultureBasedFormatter;
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        try
        {
            await authenticationService.LogoutAsync(ExecutionMode.Async(cancellationToken));

            return Ok();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Logout failed");

            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }

    [AllowAnonymous]
    [HttpGet("check")]
    [NeverRenewAuthentication]
    public IActionResult Check()
    {
        return Ok(new { isAuthenticated = currentUserAccessor.User.IsAuthenticatedOrHasWorkflow() });
    }

    [AllowAnonymous]
    [HttpGet("duration")]
    [NeverRenewAuthentication]
    public async Task<IActionResult> Duration(CancellationToken cancellationToken)
    {
        var (_, durationInMs) = await loginExpirationProvider.GetRemainingTimeAndLoginDurationInMillisecondsAsync(cancellationToken);
        var duration = new TimeSpan((durationInMs ?? 0) * 10000).ToString(@"hh\:mm\:ss");

        return Ok(new { duration });
    }

    [AllowAnonymous]
    [HttpGet("loginstarttime")]
    [NeverRenewAuthentication]
    public async Task<IActionResult> LoginStartTime(CancellationToken cancellationToken)
    {
        var user = currentUserAccessor.User;
        var userTimeZone = user.Try(u => u.GetTimeZone(), log);

        var sessionInfo = await posApiAuthenticationService.TryAsync(s => s.GetCurrentSessionAsync(cancellationToken), log);

        var startTime = dateTimeCultureBasedFormatter.Format(clock.UserLocalNow.DateTime);
        if (sessionInfo != null)
            startTime = dateTimeCultureBasedFormatter.Format(userTimeZone != null ? sessionInfo.StartTime.ConvertTo(userTimeZone).DateTime : sessionInfo.StartTime.Value);

        return Ok(new { startTime });
    }

    [HttpGet("sessiontimeleft")]
    [NeverRenewAuthentication]
    [Authorize]
    public IActionResult SessionTimeLeft()
    {
        var authProperties = HttpContext.Features.Get<IAuthenticateResultFeature>()?.AuthenticateResult?.Properties;
        var timeLeft = authProperties?.ExpiresUtc - clock.UtcNow.ValueWithOffset;

        return Ok(new { timeLeftInMiliseconds = timeLeft?.TotalMilliseconds ?? 0 });
    }
}
