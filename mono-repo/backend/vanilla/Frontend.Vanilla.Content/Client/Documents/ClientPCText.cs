#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCText"/>.
/// </summary>
public sealed class ClientPCText : ClientPCBaseComponent
{
    public string? Text { get; set; }
}
