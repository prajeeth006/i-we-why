#nullable enable
using System.Collections.Generic;
using Frontend.Vanilla.Content.Model;

namespace Frontend.Vanilla.Content.Loading.ProxyFolder;

/// <summary>
/// Represents custom vanilla proxy folder which holds additional data.
/// </summary>
public interface IVanillaProxyFolder : IProxyFolder
{
    /// <summary>
    /// Holds target data when used with client side DSL evaluation.
    /// </summary>
    IReadOnlyList<ProxyFolderChildItem> Target { get; }
}

/// <summary>
/// Represents a proxy folder child item.
/// </summary>
public sealed class ProxyFolderChildItem
{
    /// <summary>Gets the condition.</summary>
    public string? Condition { get; }

    /// <summary>Gets the child content which should be returned if <see cref="Condition" /> is matched.</summary>
    public IDocument Document { get; }

    /// <summary>Creates a new instance.</summary>
    public ProxyFolderChildItem(string? condition, IDocument document)
    {
        Condition = condition;
        Document = document;
    }
}

internal sealed class VanillaProxyFolderDocument(IDocument document, IReadOnlyList<ProxyFolderChildItem> target) : IVanillaProxyFolder
{
    public IDocumentMetadata Metadata { get; } = document.Metadata;
    public DocumentData Data { get; } = document.Data;
    public IReadOnlyList<ProxyFolderChildItem> Target { get; } = target;
}
