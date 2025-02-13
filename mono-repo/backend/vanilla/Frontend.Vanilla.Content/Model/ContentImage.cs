#nullable enable

using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Model;

/// <summary>Represents a generic content image.</summary>
public sealed class ContentImage
{
    /// <summary>Gets image source URL.</summary>
    public string Src { get; }

    /// <summary>Gets image alternate text. Can be null.</summary>
    public string? Alt { get; }

    /// <summary>Gets image width.</summary>
    public int? Width { get; }

    /// <summary>Gets image height.</summary>
    public int? Height { get; }

    /// <summary>Creates a new instance.</summary>
    public ContentImage(string src, string? alt, int? width, int? height)
    {
        Src = Guard.NotWhiteSpace(src, nameof(src));
        Alt = alt.WhiteSpaceToNull();
        Width = width;
        Height = height;
    }
}
