using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ProductSwitchCoolOff;

[ApiController]
[Route("{culture}/api/[controller]")]
[BypassAntiForgeryToken]
public class ProductSwitchCoolOffController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal;
    private readonly IClock clock;
    private readonly ILogger logger;

    public ProductSwitchCoolOffController(IServiceProvider container, IClock clock, ILogger<ProductSwitchCoolOffController> logger)
        : this(container.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), clock, logger) { }

    internal ProductSwitchCoolOffController(IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal, IClock clock, ILogger<ProductSwitchCoolOffController> logger)
    {
        this.posApiResponsibleGamingServiceInternal = posApiResponsibleGamingServiceInternal;
        this.clock = clock;
        this.logger = logger;
    }

    [HttpPost("setplayerarea")]
    public async Task<IActionResult> SetPlayerArea(SetPlayerAreaRequest setPlayerAreaRequest, CancellationToken cancellationToken)
    {
        try
        {
            setPlayerAreaRequest.EventTime = clock.UtcNow;
            await posApiResponsibleGamingServiceInternal.SetPlayerAreaAsync(setPlayerAreaRequest, ExecutionMode.Async(cancellationToken));

            return Ok();
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling set player area.");
            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling set player area.");
            return BadRequest();
        }
    }
}
