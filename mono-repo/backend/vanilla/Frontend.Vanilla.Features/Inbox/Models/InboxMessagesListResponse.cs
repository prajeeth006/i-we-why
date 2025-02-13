#nullable disable
using System.Collections.Generic;

namespace Frontend.Vanilla.Features.Inbox.Models;

internal sealed class InboxMessagesListResponse
{
    public IEnumerable<InboxMessageViewModel> Messages { get; set; }
    public int ActualReceivedNumberOfMessages { get; set; }
}
