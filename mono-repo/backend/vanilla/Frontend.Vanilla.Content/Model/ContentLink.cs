#nullable enable

using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Model;

/// <summary>Represents a generic content-defined link.</summary>
public sealed class ContentLink
{
    /// <summary>Gets the link URL.</summary>
    public Uri Url { get; }

    /// <summary>Gets the link text.</summary>
    public string? Text { get; }

    /// <summary>Gets the link attributes.</summary>
    public ContentParameters Attributes { get; }

    /// <summary>Creates a new instance.</summary>
    public ContentLink(Uri url, string? linkText, ContentParameters attributes)
    {
        Url = Guard.NotNull(url, nameof(url));
        Text = linkText.WhiteSpaceToNull();
        Attributes = Guard.NotNull(attributes, nameof(attributes));
    }
}
