#nullable enable

using System;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Client.Documents;
#pragma warning disable 1591
/// <summary>
/// A client representation of <see cref="ILinkTemplate"/>.
/// </summary>
public sealed class ClientLinkTemplate : ClientFilteredDocument
{
    public Uri? Url { get; set; }
    public string? LinkText { get; set; }
    public ContentParameters? HtmlAttributes { get; set; }
}
