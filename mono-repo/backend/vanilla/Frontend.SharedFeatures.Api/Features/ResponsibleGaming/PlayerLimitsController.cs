using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ResponsibleGaming;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class PlayerLimitsController : BaseController
{
    private readonly IPosApiResponsibleGamingServiceInternal responsibleGamingServiceInternal;
    private readonly ILogger<PlayerLimitsController> logger;

    public PlayerLimitsController(IServiceProvider provider)
        : this(provider.GetRequiredService<IPosApiResponsibleGamingServiceInternal>(), provider.GetRequiredService<ILogger<PlayerLimitsController>>()) { }

    internal PlayerLimitsController(IPosApiResponsibleGamingServiceInternal responsibleGamingServiceInternal, ILogger<PlayerLimitsController> logger)
    {
        this.responsibleGamingServiceInternal = responsibleGamingServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var playerLimits = await responsibleGamingServiceInternal.GetPlayerLimitsAsync(cancellationToken);
            var limits = playerLimits.Limits.Select(limit => new { limit.LimitType, limit.CurrentLimit });

            return Ok(new { limits });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to load PlayerLimits");

            return BadRequest();
        }
    }
}
