using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.UserSummary;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class UserSummaryController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly ILogger logger;

    public UserSummaryController(IServiceProvider provider, ILogger<UserSummaryController> logger)
        : this(provider.GetRequiredService<IPosApiWalletServiceInternal>(), logger) { }

    internal UserSummaryController(IPosApiWalletServiceInternal walletService, ILogger<UserSummaryController> logger)
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
            var transactionHistory = await walletService.GetTransactionHistoryAsync(mode);
            var activitySummary = await walletService.GetPlayerActivitySummaryAsync(mode);
            var transactionSummary = await walletService.GetUserTransactionSummaryAsync(mode);

            return Ok(new
            {
                transactionHistory.Profit,
                transactionHistory.Loss,
                activitySummary.NetProfit,
                activitySummary.NetLoss,
                activitySummary.PokerTaxCollected,
                activitySummary.CasinoTaxCollected,
                activitySummary.SportsTaxCollected,
                transactionSummary.TotalDepositamount,
                transactionSummary.TotalWithdrawalamount,
            });
        }
        catch (PosApiException posEx)
        {
            logger.LogError(posEx, "Error from PosApi while calling UserSummary GET action");

            return StatusCode(StatusCodes.Status502BadGateway);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling UserSummary GET action");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
