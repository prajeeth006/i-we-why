using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.TourneyTokenBalance;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class TourneyTokenBalanceController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly ILogger logger;

    public TourneyTokenBalanceController(IServiceProvider provider, ILogger<TourneyTokenBalanceController> logger)
        : this(provider.GetRequiredService<IPosApiWalletServiceInternal>(), logger) { }

    internal TourneyTokenBalanceController(IPosApiWalletServiceInternal walletService, ILogger<TourneyTokenBalanceController> logger)
    {
        this.walletService = walletService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var mode = ExecutionMode.Async(cancellationToken);

        try
        {
            var tourneyToken = await walletService.GetTourneyTokenBalance(mode);

            return Ok(new
            {
                tourneyToken.TourneyTokenBalance,
                tourneyToken.TourneyTokenCurrencyCode,
            });
        }
        catch (PosApiException posEx)
        {
            logger.LogError(posEx, "Error from PosApi while calling SessionFundSummary GET action");

            return StatusCode(StatusCodes.Status502BadGateway);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling SessionFundSummary GET action");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
