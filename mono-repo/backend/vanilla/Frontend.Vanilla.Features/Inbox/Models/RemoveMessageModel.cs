#nullable disable
namespace Frontend.Vanilla.Features.Inbox.Models;

/// <summary>
/// Exposed only because it is used in inbox controller.
/// </summary>
public sealed class RemoveMessageModel
{
    /// <summary>
    /// Exposed only because it is used in inbox controller.
    /// </summary>
    public string[] Ids { get; set; }
}
