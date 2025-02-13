using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.SessionLimits;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SessionLimits;

// TODO: Add unit tests
[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class SessionLimitsController : BaseController
{
    private readonly IPosApiAuthenticationServiceInternal authenticationService;
    private readonly ILogger logger;
    private readonly ICookieHandler cookieHandler;

    public SessionLimitsController(IServiceProvider container, ILogger<SessionLimitsController> log)
        : this(container.GetRequiredService<IPosApiAuthenticationServiceInternal>(), log, container.GetRequiredService<ICookieHandler>()) { }

    internal SessionLimitsController(
        IPosApiAuthenticationServiceInternal authenticationService,
        ILogger<SessionLimitsController> logger,
        ICookieHandler cookieHandler)
    {
        this.authenticationService = authenticationService;
        this.logger = logger;
        this.cookieHandler = cookieHandler;
    }

    [HttpPost("savesessionlimitspopupaction")]
    public async Task<IActionResult> Post([FromBody] string[] listOfLimits, CancellationToken cancellationToken)
    {
        try
        {
            var sso = cookieHandler.GetValue("sso");
            var sessionLimitsData = new SessionLimitsData("CONTINUE", listOfLimits.ToList(), sso);
            await authenticationService.SaveUserPopupSelection(cancellationToken, sessionLimitsData);

            return Ok();
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosApi while calling saveSessionLimitsPopupAction action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessionlimits");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling saveSessionLimitsPopupAction action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessionlimits");
        }
    }
}
