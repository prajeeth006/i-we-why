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
/// A client representation of <see cref="IPM12ColPage"/>.
/// </summary>
public sealed class ClientPM2Col : ClientPMBasePage
{
    private IReadOnlyList<ClientDocument> contentLeft = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> ContentLeft
    {
        get => contentLeft;
        set => contentLeft = Guard.NotNullItems(value.ToList(), nameof(value));
    }

    private IReadOnlyList<ClientDocument> contentRight = Array.Empty<ClientDocument>();

    public IReadOnlyList<ClientDocument> ContentRight
    {
        get => contentRight;
        set => contentRight = Guard.NotNullItems(value, nameof(value));
    }
}
