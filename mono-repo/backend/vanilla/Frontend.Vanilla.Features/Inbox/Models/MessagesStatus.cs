#nullable disable
namespace Frontend.Vanilla.Features.Inbox.Models;

/// <summary>
/// Exposed only because it is used in inbox controller.
/// </summary>
public sealed class MessagesStatus
{
    /// <summary>
    /// Exposed only because it is used in inbox controller.
    /// </summary>
    public string[] Ids { get; set; }

    /// <summary>
    /// Exposed only because it is used in inbox controller.
    /// </summary>
    public string Status { get; set; }
}
