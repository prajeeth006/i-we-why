#nullable enable

using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content;

/// <summary>
/// The metadata attached to a specific <see cref="IDocument" />.
/// </summary>
public interface IDocumentMetadata
{
    /// <summary>Gets the id of the document.</summary>
    DocumentId Id { get; }

    /// <summary>Gets the name of the template the document is based on.</summary>
    TrimmedRequiredString TemplateName { get; }

    /// <summary>Gets the version of the content from the underlying CMS.</summary>
    int Version { get; }

    /// <summary>Gets the ids of the child documents.</summary>
    IReadOnlyList<DocumentId> ChildIds { get; }

    /// <summary>Gets if the document has a filter condition set.</summary>
    public bool HasFilterCondition { get; }
}

internal sealed class DocumentMetadata(
    DocumentId id,
    TrimmedRequiredString templateName,
    int version,
    IEnumerable<DocumentId> childIds,
    UtcDateTime sitecoreLoadTime,
    bool hasFilterCondition)
    : IDocumentMetadata
{
    public DocumentId Id { get; } = id;
    public TrimmedRequiredString TemplateName { get; } = templateName;
    public int Version { get; } = version;
    public IReadOnlyList<DocumentId> ChildIds { get; } = childIds.ToList().AsReadOnly();
    public UtcDateTime SitecoreLoadTime { get; } = sitecoreLoadTime;
    public bool HasFilterCondition { get; } = hasFilterCondition;
}
