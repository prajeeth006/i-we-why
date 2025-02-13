#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IPCScrollMenu"/>.
/// </summary>
public sealed class ClientPCScrollMenu : ClientPCBaseComponent
{
    private IReadOnlyList<ClientDocument> items = Array.Empty<ClientDocument>();
    private IReadOnlyList<ClientDocument> menuItems = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> Items
    {
        get => items;
        set => items = Guard.NotNullItems(value.ToList(), nameof(value));
    }

    public IReadOnlyList<ClientDocument> MenuItems
    {
        get => menuItems;
        set => menuItems = Guard.NotNullItems(value.ToList(), nameof(value));
    }
}
