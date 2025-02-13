using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.CommunicationSettings;

[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public class CommunicationSettingsController : BaseController
{
    private readonly ICommunicationSettingsServiceClient serviceClient;
    private readonly ILogger log;

    public CommunicationSettingsController(IServiceProvider c, ILogger<CommunicationSettingsController> log)
        : this(c.GetRequiredService<ICommunicationSettingsServiceClient>(), log) { }

    internal CommunicationSettingsController(ICommunicationSettingsServiceClient serviceClient, ILogger<CommunicationSettingsController> log)
    {
        this.serviceClient = serviceClient;
        this.log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        try
        {
            var settings = await serviceClient.GetCachedAsync(ExecutionMode.Async(cancellationToken));

            return Ok(new
            {
                settings,
            });
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Service exception while getting communication settings for tracking");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
