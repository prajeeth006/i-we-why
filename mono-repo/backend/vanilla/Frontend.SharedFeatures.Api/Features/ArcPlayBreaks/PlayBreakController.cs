using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ArcPlayBreaks;

[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class PlayBreakController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal;
    private readonly ILogger logger;

    public PlayBreakController(IServiceProvider container, ILogger<PlayBreakController> logger)
        : this(container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), logger) { }

    internal PlayBreakController(IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal, ILogger<PlayBreakController> logger)
    {
        this.posApiResponsibleGamingServiceInternal = posApiResponsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlayBreak(CancellationToken cancellationToken)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var result = await posApiResponsibleGamingServiceInternal.GetPlayBreakStatus(mode);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling get arc play break status");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling get arc play break status");

            return BadRequest();
        }
    }

    [HttpPost]
    [Route("acknowledge")]
    public async Task<IActionResult> AcknowledgePlayBreakAction(
        ArcPlayBreakActionRequest playBreakActionRequest,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await posApiResponsibleGamingServiceInternal.AcknowledgePlayBreakAction(
                playBreakActionRequest,
                ExecutionMode.Async(cancellationToken));

            return Ok(new { result });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling acknowledge arc play break action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling acknowledge arc play break action");

            return BadRequest();
        }
    }
}
