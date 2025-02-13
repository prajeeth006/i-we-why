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
/// A client representation of <see cref="IProxy"/>.
/// </summary>
public sealed class ClientProxy : ClientDocument
{
    public bool IsProxy => true;

    private IReadOnlyList<ClientProxyRule> rules = Array.Empty<ClientProxyRule>();

    public IReadOnlyList<ClientProxyRule> Rules
    {
        get => rules;
        set => rules = Guard.NotNullItems(value.ToList(), nameof(value));
    }
}

public sealed class ClientProxyRule
{
    public string? Condition { get; set; }
    public ClientDocument? Document { get; set; }
}
