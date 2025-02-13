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
/// A client representation of <see cref="IPCCarousel"/>.
/// </summary>
public sealed class ClientPCCarousel : ClientPCBaseComponent
{
    public int MaxItems { get; set; }

    private IReadOnlyList<ClientDocument> items = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> Items
    {
        get => items;
        set => items = Guard.NotNullItems(value.ToList(), nameof(value));
    }
}
