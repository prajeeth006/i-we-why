#nullable enable

using System.Collections.Generic;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="IViewTemplate"/>.
/// </summary>
public sealed class ClientViewTemplate : ClientFilteredDocument
{
    public string? Text { get; set; }
    public string? Title { get; set; }
    public ContentParameters? Messages { get; set; }
    public ContentParameters? Validation { get; set; }

    private IReadOnlyDictionary<string, ClientFormElement> form = EmptyDictionary<string, ClientFormElement>.Singleton;

    public IReadOnlyDictionary<string, ClientFormElement> Form
    {
        get => form;
        set => form = Guard.NotNullValues(value.ToDictionary(), nameof(value));
    }

    private IReadOnlyDictionary<string, ClientProxy> proxy = EmptyDictionary<string, ClientProxy>.Singleton;

    public IReadOnlyDictionary<string, ClientProxy> Proxy
    {
        get => proxy;
        set => proxy = Guard.NotNullValues(value.ToDictionary(), nameof(value));
    }

    private IReadOnlyDictionary<string, ClientDocument> children = EmptyDictionary<string, ClientDocument>.Singleton;

    public IReadOnlyDictionary<string, ClientDocument> Children
    {
        get => children;
        set => children = Guard.NotNullValues(value.ToDictionary(), nameof(value));
    }

    private IReadOnlyDictionary<string, ClientLinkTemplate> links = EmptyDictionary<string, ClientLinkTemplate>.Singleton;

    public IReadOnlyDictionary<string, ClientLinkTemplate> Links
    {
        get => links;
        set => links = Guard.NotNullValues(value.ToDictionary(), nameof(value));
    }
}
