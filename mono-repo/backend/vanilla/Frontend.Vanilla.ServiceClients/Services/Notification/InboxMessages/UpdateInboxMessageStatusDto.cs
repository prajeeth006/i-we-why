using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;

internal sealed class UpdateInboxMessageStatusDto
{
    public string NewStatus { get; set; }
    public IList<string> MessageIds { get; set; }
}
