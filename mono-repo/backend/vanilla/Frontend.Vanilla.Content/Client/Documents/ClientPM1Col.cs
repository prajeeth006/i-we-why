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
/// A client representation of <see cref="IPM1ColPage"/>.
/// </summary>
public sealed class ClientPM1Col : ClientPMBasePage
{
    private IReadOnlyList<ClientDocument> content = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> Content
    {
        get => content;
        set => content = Guard.NotNullItems(value.ToList(), nameof(value));
    }
}
