using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ConnectedAccounts;

[ApiController]
[Route("{culture}/api/[controller]")]
public class ConnectedAccountsController : BaseController
{
    private readonly ICurrentUserAccessor currentUserAccessor;
    private readonly IPosApiAccountServiceInternal posApiAccountService;

    public ConnectedAccountsController(IServiceProvider container, ICurrentUserAccessor currentUserAccessor)
        : this(currentUserAccessor, container.GetRequiredService<IPosApiAccountServiceInternal>()) { }

    internal ConnectedAccountsController(ICurrentUserAccessor currentUserAccessor, IPosApiAccountServiceInternal posApiAccountService)
    {
        this.currentUserAccessor = currentUserAccessor;
        this.posApiAccountService = posApiAccountService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCount(CancellationToken cancellationToken)
    {
        if (currentUserAccessor.User.Identity is { IsAuthenticated: false })
        {
            return Ok(new { count = 0 });
        }

        var accounts = await posApiAccountService.GetConnectedAccountsAsync(cancellationToken);

        // Decreased count for one because PPOS endpoint is returning current account as connected one.
        return Ok(new { count = accounts.Count(a => a.HasAccount) - 1 });
    }
}
