using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.ServiceClients.Services.Crm.TrackerUrl;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ThirdPartyTrackingContent;

[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class ThirdPartyTrackingContentController : BaseController
{
    private readonly ITrackerUrlServiceClient trackerUrlServiceClient;
    private readonly ICookieHandler cookieHandler;
    private readonly ILogger<ThirdPartyTrackingContentController> log;

    public ThirdPartyTrackingContentController(IServiceProvider c)
        : this(c.GetRequiredService<ITrackerUrlServiceClient>(),
            c.GetRequiredService<ICookieHandler>(),
            c.GetRequiredService<ILogger<ThirdPartyTrackingContentController>>()) { }

    internal ThirdPartyTrackingContentController(
        ITrackerUrlServiceClient trackerUrlServiceClient,
        ICookieHandler cookieHandler,
        ILogger<ThirdPartyTrackingContentController> log)
    {
        this.trackerUrlServiceClient = trackerUrlServiceClient;
        this.cookieHandler = cookieHandler;
        this.log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, [FromQuery] string? channelId = null, [FromQuery] string? productId = null)
    {
        string? rawTrackerId = null, tdUid = null;

        try
        {
            rawTrackerId = cookieHandler.GetValue(CookieConstants.TrackingAffiliate);

            if (!int.TryParse(rawTrackerId, out var trackerId)) // no (usable) trackerid -> ignore
                return Ok();

            tdUid = cookieHandler.GetValue(CookieConstants.Tdpeh);

            var content = await trackerUrlServiceClient.GetAsync(ExecutionMode.Async(cancellationToken), trackerId, tdUid, channelId, productId);

            return !string.IsNullOrWhiteSpace(content) ? Ok(new { content }) : Ok();
        }
        catch (Exception ex)
        {
            log.LogError(ex,
                "Failed handling third-party tracking for tracker='{trackerId}', tdUid='{tdUid}' channelId='{channelId}', productId='{productId}'",
                rawTrackerId,
                tdUid,
                channelId,
                productId);

            return NotFound();
        }
    }
}
