using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SessionInfo;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class SessionInfoController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal responsibleGamingServiceInternal;
    private readonly ILogger logger;

    public SessionInfoController(IServiceProvider container, ILogger<SessionInfoController> log)
        : this(container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), log) { }

    internal SessionInfoController(IPosApiResponsibleGamingServiceInternal responsibleGamingServiceInternal, ILogger<SessionInfoController> logger)
    {
        this.responsibleGamingServiceInternal = responsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpGet("rcpustatus")]
    public async Task<IActionResult> RcpuStatus(CancellationToken cancellationToken)
    {
        try
        {
            var response = await responsibleGamingServiceInternal.RcpuStatusAsync(cancellationToken);

            return OkResult(response);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosApi while calling RcpuStatus action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessioninfo");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling RcpuStatus action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessioninfo");
        }
    }

    [HttpPost("rcpucontinue")]
    public async Task<IActionResult> RcpuContinue(CancellationToken cancellationToken)
    {
        try
        {
            await responsibleGamingServiceInternal.RcpuContinueAsync(cancellationToken);

            return Ok();
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosApi while calling RcpuContinue action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessioninfo");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling RcpuContinue action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessioninfo");
        }
    }

    [HttpPost]
    [Route("rcpuquit")]
    public async Task<IActionResult> RcpuQuit(CancellationToken cancellationToken)
    {
        try
        {
            await responsibleGamingServiceInternal.RcpuQuitAsync(cancellationToken);

            return Ok();
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosApi while calling RcpuQuit action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessioninfo");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling RcpuQuit action");

            return BadRequest().WithTechnicalErrorMessage(scope: "sessioninfo");
        }
    }
}
