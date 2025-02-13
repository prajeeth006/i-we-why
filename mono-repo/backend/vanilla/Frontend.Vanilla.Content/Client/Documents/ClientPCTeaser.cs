#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCTeaser"/>.
/// </summary>
public sealed class ClientPCTeaser : ClientPCBaseComponent
{
    public ContentImage? Image { get; set; }
    public ContentLink? ImageLink { get; set; }
    public string? Text { get; set; }
    public string? Subtitle { get; set; }
    public string? Summary { get; set; }
    public string? OptionalText { get; set; }
    public ContentImage? ImageOverlay { get; set; }
    public string? ImageOverlayClass { get; set; }
}
