#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCRegionalComponent"/>.
/// </summary>
public sealed class ClientPCRegionalComponent : ClientPCBaseComponent
{
    public ClientDocument? Item { get; set; }
}
