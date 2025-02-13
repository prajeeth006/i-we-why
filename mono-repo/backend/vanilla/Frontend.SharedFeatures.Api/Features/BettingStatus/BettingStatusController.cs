using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.MyBets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.BettingStatus;

[ApiController]
[Authorize]
[Route("{culture}/api/[controller]")]
public sealed class BettingStatusController : BaseController
{
    private readonly IPosApiMyBetsService myBetsService;
    private readonly ILogger log;

    public BettingStatusController(IServiceProvider c, ILogger<BettingStatusController> log)
        : this(c.GetRequiredService<IPosApiMyBetsService>(), log) { }

    internal BettingStatusController(IPosApiMyBetsService myBetsService, ILogger<BettingStatusController> log)
    {
        this.myBetsService = myBetsService;
        this.log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var hasBets = await myBetsService.GetAsync(cancellationToken, cached);

            return Ok(new
            {
                hasBets,
            });
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Service exception when getting customer bet status.");

            return BadRequest();
        }
    }
}
