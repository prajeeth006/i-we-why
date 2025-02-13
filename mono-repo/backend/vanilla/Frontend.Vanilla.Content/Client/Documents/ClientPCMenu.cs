#nullable enable

using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Menus;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IFolder"/>.
/// </summary>
public sealed class ClientPCMenu : ClientPCBaseComponent
{
    public MenuItem? Menu { get; set; }
}
