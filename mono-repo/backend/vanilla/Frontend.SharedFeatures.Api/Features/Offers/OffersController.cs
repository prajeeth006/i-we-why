using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Offers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Offers;

[ApiController]
[Authorize]
[Route("{culture}/api/[controller]")]
public sealed class OffersController : BaseController
{
    private readonly IPosApiOffersServiceClient offersServiceClient;
    private readonly ILogger logger;
    private readonly IPosApiNotificationService posApiNotificationService;

    public OffersController(IServiceProvider container, ILogger<OffersController> log)
        : this(container.GetRequiredService<IPosApiOffersServiceClient>(), log, container.GetRequiredService<IPosApiNotificationService>()) { }

    internal OffersController(IPosApiOffersServiceClient offersServiceClient, ILogger<OffersController> logger, IPosApiNotificationService posApiNotificationService)
    {
        this.offersServiceClient = offersServiceClient;
        this.logger = logger;
        this.posApiNotificationService = posApiNotificationService;
    }

    [NeverRenewAuthentication]
    [HttpGet("count")]
    public async Task<IActionResult> GetCount(CancellationToken cancellationToken)
    {
        try
        {
            var offers = await offersServiceClient.GetCountAsync(cancellationToken, "POST_LOGIN_COUNTER");

            return Ok(new
            {
                offers,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to get offers count");

            return BadRequest();
        }
    }

    [BypassAntiForgeryToken]
    [HttpGet("{offerType}/{offerId}")]
    public async Task<IActionResult> GetAsync([FromRoute] string offerType, [FromRoute] string offerId, CancellationToken cancellationToken)
    {
        if (User.Identity == null || !User.Identity.IsAuthenticated)
        {
            return Unauthorized();
        }

        var status = await posApiNotificationService.GetOfferStatusAsync(offerType, offerId, cancellationToken);

        return Ok(new { Status = status });
    }

    [BypassAntiForgeryToken]
    [HttpPost("{offerType}/{offerId}/{optIn}")]
    public async Task<IActionResult> PostAsync([FromRoute] string offerType, [FromRoute] string offerId, [FromRoute] bool optIn, CancellationToken cancellationToken)
    {
        var status = await posApiNotificationService.UpdateOfferStatusAsync(offerType, offerId, optIn, cancellationToken);

        return Ok(new { Status = status });
    }
}
