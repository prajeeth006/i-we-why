using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.SessionFundSummary;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class SessionFundSummaryController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly ILogger logger;

    public SessionFundSummaryController(IServiceProvider provider, ILogger<SessionFundSummaryController> logger)
        : this(provider.GetRequiredService<IPosApiWalletServiceInternal>(), logger) { }

    internal SessionFundSummaryController(IPosApiWalletServiceInternal walletService, ILogger<SessionFundSummaryController> logger)
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
            var sessionFundSummary = await walletService.GetSessionFundSummary(mode);

            return Ok(new
            {
                sessionFundSummary.Profit,
                sessionFundSummary.Loss,
                sessionFundSummary.InitialBalance,
                sessionFundSummary.CurrentBalance,
                sessionFundSummary.TotalStake,
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
