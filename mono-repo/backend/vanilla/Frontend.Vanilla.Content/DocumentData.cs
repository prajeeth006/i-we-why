#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Holds the values retrieved from a document source (e.g. Sitecore file, Sitecore web request, etc.).
/// </summary>
public sealed class DocumentData
{
    internal static readonly StringComparer FieldComparer = StringComparer.OrdinalIgnoreCase;

    /// <summary>Gets the metadata.</summary>
    public IDocumentMetadata Metadata { get; }

    /// <summary>Gets field values (i.e. the actual data).</summary>
    public IReadOnlyDictionary<string, object?> Fields { get; }

    /// <summary>Initializes a new instance.</summary>
    public DocumentData(IDocumentMetadata metadata, IEnumerable<KeyValuePair<string, object?>> fields)
    {
        Metadata = Guard.NotNull(metadata, nameof(metadata));
        Fields = Guard.NotNull(fields, nameof(fields)).ToDictionary(FieldComparer).AsReadOnly();
    }
}
