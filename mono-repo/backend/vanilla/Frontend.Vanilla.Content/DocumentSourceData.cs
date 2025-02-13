#nullable enable

using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Holds the values retrieved from a document source (e.g. Sitecore file, Sitecore web request, etc.).
/// </summary>
internal sealed class DocumentSourceData(IDocumentMetadata metadata, IEnumerable<KeyValuePair<string, string?>> fields)
{
    public IDocumentMetadata Metadata { get; } = metadata;
    public IReadOnlyDictionary<string, string?> Fields { get; } = fields.ToDictionary(DocumentData.FieldComparer);
}
