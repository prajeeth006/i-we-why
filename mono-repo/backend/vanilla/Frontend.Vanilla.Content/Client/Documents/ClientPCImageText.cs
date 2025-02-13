#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCImageText"/>.
/// </summary>
public sealed class ClientPCImageText : ClientPCBaseComponent
{
    public ContentImage? Image { get; set; }
    public ContentLink? ImageLink { get; set; }
    public string? Text { get; set; }
}
