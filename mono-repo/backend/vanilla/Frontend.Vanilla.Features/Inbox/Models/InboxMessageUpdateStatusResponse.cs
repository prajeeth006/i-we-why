#nullable disable
namespace Frontend.Vanilla.Features.Inbox.Models;

internal sealed class InboxMessageUpdateStatusResponse
{
    public bool IsUpdated { get; set; }
    public string Result { get; set; }
    public InboxMessageViewModel Message { get; set; }
}
