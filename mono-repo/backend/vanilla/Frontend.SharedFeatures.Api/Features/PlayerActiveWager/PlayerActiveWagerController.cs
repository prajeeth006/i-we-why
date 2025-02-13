using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.PlayerActiveWager;

[ApiController]
[Route("{culture}/api/activeWagerDetails")]
public sealed class PlayerActiveWagerController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletServiceInternal;
    private readonly ILogger<PlayerActiveWagerController> logger;

    public PlayerActiveWagerController(IServiceProvider container, ILogger<PlayerActiveWagerController> logger)
        : this(container.GetRequiredService<IPosApiWalletServiceInternal>(), logger) { }

    internal PlayerActiveWagerController(IPosApiWalletServiceInternal walletServiceInternal, ILogger<PlayerActiveWagerController> logger)
    {
        this.walletServiceInternal = walletServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var activeWager = await walletServiceInternal.GetActiveWagerDetails(cancellationToken);

            return OkResult(activeWager);
        }
        catch (PosApiException posEx)
        {
            logger.LogError(posEx, "Error from PosApi while calling ActiveWagerDetails action");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling ActiveWagerDetails get action");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
