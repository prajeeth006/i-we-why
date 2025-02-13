#nullable enable

using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content.Model;

/// <summary>Represents a custom content video.</summary>
public sealed class ContentVideo
{
    /// <summary>Gets video source ID.</summary>
    public string Id { get; }

    /// <summary>Gets video source URI.</summary>
    public string Src { get; }

    /// <summary>Gets video width.</summary>
    public int? Width { get; }

    /// <summary>Gets video height.</summary>
    public int? Height { get; }

    /// <summary>Creates a new instance.</summary>
    public ContentVideo(string id, string src, int? width, int? height)
    {
        Id = Guard.NotWhiteSpace(id, nameof(id));
        Src = Guard.NotWhiteSpace(src, nameof(src));
        Width = width;
        Height = height;
    }
}
