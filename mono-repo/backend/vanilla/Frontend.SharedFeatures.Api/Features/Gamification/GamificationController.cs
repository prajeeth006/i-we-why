using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Gamification;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.Gamification;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Gamification;

[ApiController]
[Route("{culture}/api/[controller]")]
public class GamificationController : BaseController
{
    private readonly IPosApiCrmServiceInternal crmServiceInternal;
    private readonly ILogger<GamificationController> logger;
    private readonly IGamificationConfiguration config;

    public GamificationController(IServiceProvider container, ILogger<GamificationController> logger)
        : this(container.GetRequiredService<IPosApiCrmServiceInternal>(), container.GetRequiredService<IGamificationConfiguration>(), logger) { }

    internal GamificationController(IPosApiCrmServiceInternal crmServiceInternal, IGamificationConfiguration config, ILogger<GamificationController> logger)
    {
        this.crmServiceInternal = crmServiceInternal;
        this.logger = logger;
        this.config = config;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var coinsBalance = await crmServiceInternal.GamificationCoinsBalance(mode,
                new CoinsBalanceRequest(new SourceInfo { Source = "Vanilla" }, config.CoinsExpiringInDays, null));

            return OkResult(coinsBalance);
        }
        catch (PosApiException posEx)
        {
            logger.LogError(posEx, "Error from PosApi while calling GamificationCoinsBalance POST action");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling GamificationCoinsBalance POST action");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
