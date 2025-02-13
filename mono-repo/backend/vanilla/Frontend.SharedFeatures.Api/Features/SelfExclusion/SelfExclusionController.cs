using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SelfExclusion;

[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class SelfExclusionController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal;
    private readonly ILogger logger;

    public SelfExclusionController(IServiceProvider container, ILogger<SelfExclusionController> logger)
        : this(container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), logger) { }

    internal SelfExclusionController(IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal, ILogger<SelfExclusionController> logger)
    {
        this.posApiResponsibleGamingServiceInternal = posApiResponsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    [NeverRenewAuthentication]
    public async Task<IActionResult> GetDetails(CancellationToken cancellationToken)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var result = await posApiResponsibleGamingServiceInternal.GetSelfExclusionDetailsAsync(mode);

            return OkResult(result);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling selfExclusionDetails action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling selfExclusionDetails action");

            return BadRequest();
        }
    }
}
