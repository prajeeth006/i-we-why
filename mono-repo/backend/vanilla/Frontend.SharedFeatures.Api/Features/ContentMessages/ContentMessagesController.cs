using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.ContentMessages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.ContentMessages;

[AllowAnonymous]
[Route("{culture}/api/[controller]")]
[ApiController]
public class ContentMessagesController : BaseController
{
    private readonly IContentMessagesService contentMessagesService;
    private readonly ILogger log;

    public ContentMessagesController(IServiceProvider c)
        : this(c.GetRequiredService<IContentMessagesService>(), c.GetRequiredService<ILogger<ContentMessagesController>>()) { }

    internal ContentMessagesController(IContentMessagesService contentMessagesService, ILogger<ContentMessagesController> log)
    {
        this.contentMessagesService = contentMessagesService;
        this.log = log;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string path, CancellationToken cancellationToken, string? closedCookieKey = "", bool evaluateFullOnServer = false)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            return BadRequest("Path is required.");
        }

        try
        {
            var messages = string.IsNullOrWhiteSpace(closedCookieKey)
                ? await contentMessagesService.GetMessagesAsync(cancellationToken, path)
                : await contentMessagesService.GetMessagesAsync(cancellationToken, path, closedCookieKey, evaluateFullOnServer);

            return Ok(new { messages });
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to get {path} with full on server evaluation: {filter}", path, evaluateFullOnServer);

            return StatusCode(StatusCodes.Status500InternalServerError, ex);
        }
    }
}
