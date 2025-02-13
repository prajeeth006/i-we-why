using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ScreenTime;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ScreenTimeController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal;
    private readonly ILogger logger;

    public ScreenTimeController(IServiceProvider container, ILogger<ScreenTimeController> logger)
        : this(container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), logger) { }

    internal ScreenTimeController(IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal, ILogger<ScreenTimeController> logger)
    {
        this.posApiResponsibleGamingServiceInternal = posApiResponsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpPost]
    [Route("save")]
    [NeverRenewAuthentication]
    [BypassAntiForgeryToken]
    public async Task<IActionResult> SaveScreenTimeAction(
        ScreenTimeSaveRequest screenTimeSaveRequest,
        CancellationToken cancellationToken)
    {
        try
        {
            await posApiResponsibleGamingServiceInternal.SaveScreenTimeAsync(
                screenTimeSaveRequest,
                ExecutionMode.Async(cancellationToken));

            return Ok();
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling save screen time");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling save screen time");

            return BadRequest();
        }
    }
}
