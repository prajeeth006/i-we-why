using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Promohub;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.BonusAward;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class BonusAwardController : BaseController
{
    private readonly ILogger logger;
    private readonly IPosApiPromohubServiceInternal posApiPromoHubService;

    public BonusAwardController(IServiceProvider provider, ILogger<BonusAwardController> log)
        : this(provider.GetRequiredService<IPosApiPromohubServiceInternal>(), log) { }

    internal BonusAwardController(IPosApiPromohubServiceInternal posApiPromoHubService, ILogger<BonusAwardController> logger)
    {
        this.posApiPromoHubService = posApiPromoHubService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string offerId, CancellationToken cancellationToken)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var result = await posApiPromoHubService.GetBonusAwardAsync(mode, offerId);

            return Ok(new
            {
                isBonusAwarded = result.IssuedBonus.DirectAward,
            });
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling Get BonusAward action");

            return BadRequest(sex.ErrorMessage());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling Get BonusAward action");

            return BadRequest();
        }
    }
}
