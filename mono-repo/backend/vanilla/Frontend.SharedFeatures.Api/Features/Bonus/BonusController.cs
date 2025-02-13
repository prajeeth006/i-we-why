using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Bonus;

[ApiController]
[Authorize]
[Route("{culture}/api/bonus")]
public sealed class BonusController : BaseController
{
    private readonly ICrmService crmService;

    public BonusController(IServiceProvider container)
        : this(container.GetRequiredService<ICrmService>()) { }

    internal BonusController(ICrmService crmService)
    {
        this.crmService = crmService;
    }

    [HttpPost]
    [Route("updatebonustncacceptance")]
    public async Task<IActionResult> UpdateBonusTncAcceptance([FromBody] BonusTncAcceptance bonusTncAcceptance, CancellationToken cancellationToken)
    {
        var updated = await crmService.UpdateBonusTncAcceptanceAsync(bonusTncAcceptance, cancellationToken);

        return Ok(new { updated });
    }

    [HttpPost]
    [Route("dropbonusoffer")]
    public async Task<IActionResult> DropBonusOffer([FromBody] DropBonusOffer dropBonusOffer, CancellationToken cancellationToken)
    {
        var dropped = await crmService.DropBonusOfferAsync(dropBonusOffer, cancellationToken);

        return Ok(new { dropped });
    }
}
