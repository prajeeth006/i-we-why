using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Balance;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public class BalanceController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly IPosApiCrmServiceInternal crmService;
    private readonly ILogger<BalanceController> log;

    public BalanceController(IServiceProvider c, ILogger<BalanceController> log)
        : this(c.GetRequiredService<IPosApiWalletServiceInternal>(), c.GetRequiredService<IPosApiCrmServiceInternal>(), log) { }

    internal BalanceController(IPosApiWalletServiceInternal walletService, IPosApiCrmServiceInternal crmService, ILogger<BalanceController> log)
    {
        this.walletService = walletService;
        this.crmService = crmService;
        this.log = log;
    }

    [NeverRenewAuthentication]
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var balance = await walletService.GetBalanceAsync(cancellationToken, cached: false);

            return Ok(new { balance });
        }
        catch (PosApiException sex)
        {
            log.LogError(sex, "Error from PosAPI while getting the balance");

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(scope: "get");
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General error while getting the balance");

            return BadRequest().WithTechnicalErrorMessage(scope: "get");
        }
    }

    [NeverRenewAuthentication]
    [HttpGet("bonus")]
    public async Task<IActionResult> BonusBalance(CancellationToken cancellationToken)
    {
        return Ok(await crmService.GetBonusBalanceAsync(cancellationToken, false));
    }

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferBalance transferBalance, CancellationToken token)
    {
        try
        {
            await walletService.TransferBalanceAsync(transferBalance, token);

            return Ok();
        }
        catch (PosApiException ex)
        {
            log.LogError(ex, "Service exception while transferring balances");

            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }
}
