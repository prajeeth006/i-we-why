using System.Net.Http.Headers;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.RtmsLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Rtms;

[Authorize]
[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class RtmsController : BaseController
{
    private readonly ILogger logger;

    private readonly IRtmsMessagesClientValuesProvider rtmsMessagesClientValuesProvider;
    private readonly IContentService contentService;
    private readonly IVanillaClientContentService clientContentService;
    private const string RtmsContentPath = AppPlugin.ObsoleteContentRoot + "/Rtms/Rtms";
    private const string RtmsErrorScope = "rtms";

    public RtmsController(
        IServiceProvider container,
        IContentService contentService,
        ILogger<RtmsController> log)
        : this(container.GetRequiredService<IRtmsMessagesClientValuesProvider>(),
            container.GetRequiredService<IVanillaClientContentService>(),
            contentService,
            log) { }

    internal RtmsController(
        IRtmsMessagesClientValuesProvider rtmsMessagesClientValuesProvider,
        IVanillaClientContentService clientContentService,
        IContentService contentService,
        ILogger<RtmsController> logger)
    {
        this.rtmsMessagesClientValuesProvider = rtmsMessagesClientValuesProvider;
        this.clientContentService = clientContentService;
        this.contentService = contentService;
        this.logger = logger;
    }

    [HttpGet("subdomainmsgcontainercontent")]
    [Obsolete("Deprecated as usage removed from client. Will be deleted in next major, 14.0.0")]
    public HttpResponseMessage GetSubDomainMsgContainerContent()
    {
        var content = contentService.GetRequired<IStaticFileTemplate>(AppPlugin.ObsoleteContentRoot + "/rtms/subdomainmsgcontainerhtml");
        var response = new HttpResponseMessage { Content = new StringContent(content.Content!) };
        response.Content.Headers.ContentType = new MediaTypeHeaderValue(content.MimeType!);

        return response;
    }

    [HttpPost("messages")]
    public IActionResult PostMessages(IEnumerable<RtmsMessageRequest> rtmsMessageRequest)
    {
        try
        {
            return Ok(new RtmsMessageResponse(rtmsMessagesClientValuesProvider.GetMessages(rtmsMessageRequest)));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed GetMessages");

            return BadRequest().WithTechnicalErrorMessage(scope: RtmsErrorScope);
        }
    }

    [HttpGet("messagesinitdata")]
    public async Task<IActionResult> GetMessagesInitData(CancellationToken cancellationToken)
    {
        try
        {
            var result = await clientContentService.GetAsync(RtmsContentPath, cancellationToken);

            return OkResult(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetMessagesInitData failed");

            return BadRequest().WithTechnicalErrorMessage(scope: RtmsErrorScope);
        }
    }
}
