using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Cashier;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class CashierController : BaseController
{
    private readonly IPosApiWalletServiceInternal walletService;
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly ILogger<CashierController> logger;

    public CashierController(IServiceProvider container, ICurrentUserAccessor currentUserAccessor, ILogger<CashierController> logger)
        : this(container.GetRequiredService<IPosApiWalletServiceInternal>(), currentUserAccessor, logger) { }

    internal CashierController(IPosApiWalletServiceInternal walletService, ICurrentUserAccessor currentUserAccessor, ILogger<CashierController> logger)
    {
        this.walletService = walletService;
        this.currentUserAccessor = currentUserAccessor;
        this.logger = logger;
    }

    [HttpGet("quickdepositenabled")]
    public async Task<IActionResult> QuickDepositEnabled(CancellationToken cancellationToken)
    {
        try
        {
            var enabled = currentUserAccessor.User.Identity is { IsAuthenticated: true } &&
                          await walletService.IsQuickDepositAllowedAsync(cancellationToken);

            return Ok(new { enabled });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed getting quick deposit");

            return Ok(new { enabled = false });
        }
    }
}
