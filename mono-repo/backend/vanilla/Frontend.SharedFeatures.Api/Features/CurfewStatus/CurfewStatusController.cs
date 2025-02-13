using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.CurfewStatus;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class CurfewStatusController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly ILogger logger;

    public CurfewStatusController(IServiceProvider provider, ILogger<CurfewStatusController> log)
        : this(provider.GetRequiredService<IPosApiWalletServiceInternal>(), log) { }

    internal CurfewStatusController(IPosApiWalletServiceInternal walletService, ILogger<CurfewStatusController> logger)
    {
        this.walletService = walletService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached = true)
    {
        try
        {
            var curfewStatus = await walletService.GetCurfewStatusAsync(cancellationToken, cached);

            return Ok(new
            {
                curfewStatus,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error");

            return BadRequest().WithTechnicalErrorMessage();
        }
    }
}
