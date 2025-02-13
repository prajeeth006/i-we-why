#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCVideo"/>.
/// </summary>
public sealed class ClientPCVideo : ClientPCBaseComponent
{
    public ContentVideo? Video { get; set; }
    public bool Controls { get; set; }
}
