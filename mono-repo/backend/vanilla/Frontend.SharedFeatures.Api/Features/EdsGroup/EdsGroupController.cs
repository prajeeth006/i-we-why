using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.AntiForgeryProtection;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.EdsGroup;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.EdsGroup;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class EdsGroupController : BaseController
{
    private readonly IEdsGroupService edsGroupService;
    private readonly IPosApiNotificationService posApiNotificationService;
    private readonly ILogger logger;

    public EdsGroupController(IServiceProvider container, IPosApiNotificationService posApiNotificationService, ILogger<EdsGroupController> logger)
        : this(container.GetRequiredService<IEdsGroupService>(), posApiNotificationService, logger) { }

    internal EdsGroupController(IEdsGroupService edsGroupService, IPosApiNotificationService posApiNotificationService, ILogger<EdsGroupController> logger)
    {
        this.edsGroupService = edsGroupService;
        this.posApiNotificationService = posApiNotificationService;
        this.logger = logger;
    }

    [BypassAntiForgeryToken]
    [HttpPost("{eventId}/{optIn}")]
    public async Task<IActionResult> PostAsync([FromRoute] string eventId, [FromRoute] bool optIn, CancellationToken cancellationToken)
    {
        var status = await edsGroupService.OptInAsync(ExecutionMode.Async(cancellationToken),
            new EdsGroupOptInRequest
            {
                EventId = eventId,
                Optin = optIn,
                Source = "CMS",
            });

        return Ok(new { Status = status });
    }

    [BypassAntiForgeryToken]
    [HttpGet("{groupId}")]
    public async Task<IActionResult> GetAsync([FromRoute] string groupId, CancellationToken cancellationToken)
    {
        try
        {
            var edsGroupStatus = await posApiNotificationService.GetEdsGroupStatusAsync(ExecutionMode.Async(cancellationToken), groupId, false);

            return OkResult(edsGroupStatus);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling eds group status");

            return BadRequest(sex.ErrorMessage()).WithErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling eds group status");

            return BadRequest();
        }
    }
}
