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
/// A client representation of <see cref="IPMNav1ColPage"/>.
/// </summary>
public sealed class ClientPMNav1Col : ClientPMBasePage
{
    private IReadOnlyList<ClientDocument> navigation = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> Navigation
    {
        get => navigation;
        set => navigation = Guard.NotNullItems(value.ToList(), nameof(value));
    }

    private IReadOnlyList<ClientDocument> content = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> Content
    {
        get => content;
        set => content = Guard.NotNullItems(value.ToList(), nameof(value));
    }
}
