#nullable enable

using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Model;

/// <summary>
/// Represents a list item entry (e.g. in an HTML <c>select</c> element).
/// </summary>
public sealed class ListItem
{
    /// <summary>Gets the value.</summary>
    public string Value { get; }

    /// <summary>Gets the text.</summary>
    public string Text { get; }

    /// <summary>Creates a new instance.</summary>
    public ListItem(string value, string text)
    {
        Value = Guard.NotNull(value, nameof(value));
        Text = Guard.NotNull(text, nameof(text));
    }
}
