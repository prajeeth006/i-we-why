using Frontend.Vanilla.Core.System;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

/// <summary>
/// filter criteria for INotificationService.GetInboxMessages.
/// </summary>
public sealed class InboxMessageFilter
{
    /// <summary>
    /// Only show messages with this status.
    /// </summary>
    [CanBeNull]
    public string Status { get; set; }

    /// <summary>
    /// Only show messages from this source.
    /// </summary>
    [CanBeNull]
    public string MessageSource { get; set; }

    /// <summary>
    /// Only show messages younger than this.
    /// </summary>
    public UtcDateTime? StartDate { get; set; }

    /// <summary>
    /// Only show messages older than this.
    /// </summary>
    public UtcDateTime? EndDate { get; set; }

    /// <summary>
    /// Paging: number of messages per page.
    /// </summary>
    public int? PageSize { get; set; }

    /// <summary>
    /// Paging: page to show.
    /// </summary>
    public int? PageIndex { get; set; }
}
