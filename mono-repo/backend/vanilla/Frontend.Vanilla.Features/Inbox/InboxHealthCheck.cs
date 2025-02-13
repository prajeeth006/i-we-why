using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Features.Inbox.Models;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

namespace Frontend.Vanilla.Features.Inbox;

internal sealed class InboxHealthCheck(
    IInboxConfiguration config,
    ICurrentUserAccessor currentUserAccessor,
    IPosApiNotificationService notificationService,
    IInboxMessagesClientValuesProvider inboxClientValuesProvider)
    : IHealthCheck
{
    public bool IsEnabled => config.Enabled;

    public HealthCheckMetadata Metadata { get; } = new (
        name: "Inbox Health",
        description: "Inbox Health Info.",
        whatToDoIfFailed: "Follow error details.",
        configurationFeatureName: InboxConfiguration.FeatureName);

    public async Task<HealthCheckResult> ExecuteAsync(CancellationToken cancellationToken)
    {
        if (!config.Enabled)
        {
            return HealthCheckResult.DisabledFeature;
        }

        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
        {
            return HealthCheckResult.CreateSuccess("User needs to be logged in.");
        }

        try
        {
            var newMessagesCount = await notificationService.GetInboxMessageCountAsync("NEW", cancellationToken);
            var messages = await GetAllMessagesAsync(cancellationToken);
            var errorMessages = messages.Where(m => m.Error != null).ToList();

            return errorMessages.Count == 0
                ? HealthCheckResult.CreateSuccess($"Inbox messages fetched successfully. Count of new messages is {newMessagesCount}.")
                : HealthCheckResult.CreateFailed(
                    $"Received a total of {messages.Count} message(s) (of which {newMessagesCount} new message(s)), but error found in {errorMessages.Count} message(s).",
                    errorMessages.Select(e => e.Error).Join());
        }
        catch (Exception ex)
        {
            return HealthCheckResult.CreateFailed("Error occured trying to fetch inbox data. Check details.", ex);
        }
    }

    private async Task<List<InboxMessageViewModel>> GetAllMessagesAsync(CancellationToken cancellationToken)
    {
        var newMessages = await notificationService.GetInboxMessagesAsync(new InboxMessageFilter { Status = "NEW" }, cancellationToken);
        var messages = await notificationService.GetInboxMessagesAsync(new InboxMessageFilter { Status = "ALL" }, cancellationToken);
        var allMessages = new List<InboxMessageViewModel>();
        allMessages.AddRange(inboxClientValuesProvider.GetMessages(newMessages, true));
        allMessages.AddRange(inboxClientValuesProvider.GetMessages(messages, true));

        return allMessages;
    }
}
