#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Utils;

#pragma warning disable 1591
namespace Frontend.Vanilla.Content.Client.Documents;

public sealed class ClientFormElement : ClientFilteredDocument
{
    public string? Id { get; set; }
    public string? Label { get; set; }
    public string? ToolTip { get; set; }
    public ContentParameters? Validation { get; set; }
    public string? Watermark { get; set; }
    public ContentParameters? HtmlAttributes { get; set; }

    private IReadOnlyList<ClientListItem> values = Array.Empty<ClientListItem>();

    public IReadOnlyList<ClientListItem> Values
    {
        get => values;
        set => values = Guard.NotNullItems(value, nameof(value));
    }
}

public sealed class ClientListItem
{
    public string? Value { get; set; }
    public string? Text { get; set; }
}
