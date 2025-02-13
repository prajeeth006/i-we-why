#nullable enable

using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// The interface that represents a document from an underlying CMS.
/// </summary>
public interface IDocument
{
    /// <summary>Gets the document's <see cref="IDocumentMetadata" />.</summary>
    IDocumentMetadata Metadata { get; }

    /// <summary>Gets the underlying document data.</summary>
    DocumentData Data { get; }
}

/// <summary>
/// An abstract class that represents a document in an underlying CMS.
/// </summary>
public abstract class Document : ToStringEquatable<Document>, IDocument
{
    /// <summary>Gets comparer used in content API for names of templates, fields etc.</summary>
    internal static readonly IEqualityComparer<TrimmedRequiredString> Comparer = RequiredStringComparer.OrdinalIgnoreCase;

    /// <summary>Gets the underlying document data.</summary>
    public DocumentData Data { get; }

    /// <summary>Gets the document's <see cref="IDocumentMetadata" />.</summary>
    public IDocumentMetadata Metadata => Data.Metadata;

    /// <summary>Creates a new instance.</summary>
    protected Document(DocumentData data)
        => Data = Guard.NotNull(data, nameof(data));

    /// <summary>
    /// Gets value from the documents collection of values.
    /// </summary>
    /// <typeparam name="TValue">The type to convert the value to.</typeparam>
    /// <param name="name">The name of the value to retrieve.</param>
    /// <returns>The value converted to the type specified in <typeparamref name="TValue"/>.</returns>
    protected TValue GetValue<TValue>(string name)
    {
        if (!Data.Fields.TryGetValue(name, out var result))
            throw GetError("Unable to find an entry for the field.");

        try
        {
            return (TValue)result!;
        }
        catch
        {
            throw GetError($"Unable to cast {result?.GetType().ToString() ?? "null"} to {typeof(TValue)}.");
        }

        Exception GetError(string problem)
            => throw new Exception(
                $"{problem} Failed in field '{name}' of content {Metadata.Id} of template '{Metadata.TemplateName}' -> {GetType()}." +
                " Most likely the auto generated code is out of sync with the template definitions?");
    }

    /// <summary>Returns a <see cref="string" /> that represents this instance.</summary>
    public override string ToString()
        => Data.Metadata.Id.ToString();
}
