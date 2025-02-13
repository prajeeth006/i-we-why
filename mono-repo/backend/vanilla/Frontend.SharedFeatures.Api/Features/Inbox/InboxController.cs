using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Inbox;
using Frontend.Vanilla.Features.Inbox.Models;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.Inbox;

/// <summary>
/// Features related to user's inbox messages.
/// </summary>
[Authorize]
[Route("{culture}/api/[controller]")]
[ApiController]
public sealed class InboxController : BaseController
{
    private readonly ILogger logger;
    private readonly IInboxMessagesClientValuesProvider inboxClientValuesProvider;
    private readonly IPosApiNotificationService notificationService;
    private readonly IVanillaClientContentService clientContentService;

    private const string InboxContentPath = "MobileLogin-v1.0/Inbox/Inbox";
    private const string InboxMessageQueue = "INBOX";

    public InboxController(IServiceProvider container)
        : this(
            container.GetRequiredService<IInboxMessagesClientValuesProvider>(),
            container.GetRequiredService<IPosApiNotificationService>(),
            container.GetRequiredService<IVanillaClientContentService>(),
            container.GetRequiredService<ILogger<InboxController>>()) { }

    internal InboxController(
        IInboxMessagesClientValuesProvider inboxClientValuesProvider,
        IPosApiNotificationService notificationService,
        IVanillaClientContentService clientContentService,
        ILogger<InboxController> logger)
    {
        this.inboxClientValuesProvider = inboxClientValuesProvider;
        this.notificationService = notificationService;
        this.clientContentService = clientContentService;
        this.logger = logger;
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetList(int pageIndex, int pageSize, StatusType messageStatus, CancellationToken cancellationToken)
    {
        try
        {
            List<InboxMessageViewModel> nextMessages;

            if (messageStatus == StatusType.NEW)
            {
                nextMessages = await GetNextMessagesAsync(pageIndex, pageSize, StatusType.NEW, cancellationToken);

                if (nextMessages.Count < pageSize)
                {
                    var notNewMessages = await GetNextMessagesAsync(0, pageSize, StatusType.ALL, cancellationToken);
                    nextMessages.AddRange(notNewMessages);
                }
            }
            else
            {
                nextMessages = await GetNextMessagesAsync(pageIndex, pageSize, StatusType.ALL, cancellationToken);
            }

            return Ok(new InboxMessagesListResponse
            {
                Messages = nextMessages,
                ActualReceivedNumberOfMessages = nextMessages.Count,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed getting paged inbox messages");

            return BadRequest().WithTechnicalErrorMessage(scope: InboxMessageQueue);
        }
    }

    /// <summary>
    /// Provides count of user's new inbox messages.
    /// </summary>
    [HttpGet("count")]
    [NeverRenewAuthentication]
    public async Task<IActionResult> GetMessagesCount(CancellationToken cancellationToken)
    {
        try
        {
            var count = await notificationService.GetInboxMessageCountAsync("NEW", cancellationToken);

            return Ok(new
            {
                count,
            });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed getting inbox messages count");

            return BadRequest().WithTechnicalErrorMessage("inboxgetmessagescount");
        }
    }

    [HttpGet("initdata")]
    public async Task<IActionResult> GetMessagesInitData(CancellationToken cancellationToken)
    {
        try
        {
            return Ok(new { Content = await clientContentService.GetAsync(InboxContentPath, cancellationToken) });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetMessagesInitData failed");

            return BadRequest().WithTechnicalErrorMessage();
        }
    }

    [HttpGet("single")]
    public async Task<IActionResult> GetSingle(string id, CancellationToken cancellationToken)
    {
        try
        {
            var inboxMessage = await notificationService.GetSingleInboxMessageAsync(id, cancellationToken);
            var message = inboxClientValuesProvider.GetMessage(inboxMessage);

            return Ok(new InboxMessageResponse { Message = message });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed getting message with {id}", id);

            return BadRequest().WithTechnicalErrorMessage();
        }
    }

    [HttpPost("setstatus")]
    public async Task<IActionResult> SetStatus(MessagesStatus messagesStatus, CancellationToken cancellationToken)
    {
        try
        {
            await notificationService.UpdateInboxMessageStatusAsync(messagesStatus.Ids, messagesStatus.Status.ToUpper(), cancellationToken);

            return Ok(new InboxMessageUpdateStatusResponse { IsUpdated = true });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed setting {@messagesStatus}", messagesStatus);

            return BadRequest().WithTechnicalErrorMessage(scope: InboxMessageQueue);
        }
    }

    [HttpPost("remove")]
    public async Task<IActionResult> Remove(RemoveMessageModel model, CancellationToken cancellationToken)
    {
        try
        {
            await notificationService.UpdateInboxMessageStatusAsync(model.Ids, "DELETED", cancellationToken);

            return Ok(new InboxMessageUpdateStatusResponse { IsUpdated = true });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed removing messages with {ids}", EnumerableExtensions.Join(model.Ids));

            return BadRequest().WithTechnicalErrorMessage(scope: InboxMessageQueue);
        }
    }

    private async Task<List<InboxMessageViewModel>> GetNextMessagesAsync(int pageIndex, int pageSize, StatusType statusType, CancellationToken cancellationToken)
    {
        var messages = await notificationService.GetInboxMessagesAsync(new InboxMessageFilter
        {
            Status = statusType.ToString(),
            PageIndex = pageIndex,
            PageSize = pageSize,
        }, cancellationToken);
        var returnedMessages = inboxClientValuesProvider.GetMessages(messages).ToList();

        return returnedMessages;
    }
}
