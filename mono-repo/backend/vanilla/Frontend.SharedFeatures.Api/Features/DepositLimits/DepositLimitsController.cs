using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.DepositLimits;

[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class DepositLimitsController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal;
    private readonly ILogger logger;

    public DepositLimitsController(IServiceProvider container, ILogger<DepositLimitsController> logger)
        : this(container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), logger) { }

    internal DepositLimitsController(IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal, ILogger<DepositLimitsController> logger)
    {
        this.posApiResponsibleGamingServiceInternal = posApiResponsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepositLimits(CancellationToken cancellationToken)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var limits = await posApiResponsibleGamingServiceInternal.GetDepositLimitsAsync(mode);

            return Ok(new
            {
                limits,
            });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling deposit limits action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling deposit limits action");

            return BadRequest();
        }
    }
}
