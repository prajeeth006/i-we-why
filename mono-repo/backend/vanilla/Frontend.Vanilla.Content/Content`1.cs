#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Provides all information collected during a content retrieval operation.
/// </summary>
public abstract class Content<TDocument>
    where TDocument : class, IDocument
{
    /// <summary>Gets the document status.</summary>
    public abstract DocumentStatus Status { get; }

    /// <summary>Gets the id of the document.</summary>
    public DocumentId Id { get; }

    /// <summary>Gets the document's metadata. It is null in case of <see cref="DocumentStatus.NotFound" /> and can be null in case of <see cref="DocumentStatus.Invalid" />.</summary>
    public abstract IDocumentMetadata? Metadata { get; }

    private protected Content(DocumentId id)
        => Id = Guard.NotNull(id, nameof(id));

    /// <summary>Gets string describing the content and it's status details.</summary>
    public override string ToString()
        => $"{Status} content {Id}";
}

/// <summary>Represents status of the document of particular content item.</summary>
public enum DocumentStatus
{
    /// <summary>The content is <see cref="SuccessContent{TDocument}" />.</summary>
    Success = 0,

    /// <summary>Document contains some <see cref="InvalidContent{TDocument}.Errors" /> thus is null.</summary>
    Invalid = 1,

    /// <summary>The content is <see cref="NotFoundContent{TDocument}" />.</summary>
    NotFound = 2,

    /// <summary>The content is <see cref="FilteredContent{TDocument}" />.</summary>
    Filtered = 3,
}

/// <summary>Successfully loaded content with a <see cref="Document" />.</summary>
public sealed class SuccessContent<TDocument> : Content<TDocument>
    where TDocument : class, IDocument
{
    /// <summary>Gets <see cref="DocumentStatus.Success" /> status.</summary>
    public override DocumentStatus Status => DocumentStatus.Success;

    /// <summary>Gets the retrieved document.</summary>
    public TDocument Document { get; }

    /// <summary>Gets the <see cref="DslEvaluation" /> type, after the condition was evaluated. Null if there was no condition specified in the document.</summary>
    public DslEvaluation? ConditionResultType { get; set; }

    /// <summary>Gets the metadata from <see cref="Document" />.</summary>
    public override IDocumentMetadata Metadata => Document.Metadata;

    /// <summary>Creates a new instance.</summary>
    public SuccessContent(TDocument document, DslEvaluation? conditionResultType = null)
        : base(Guard.NotNull(document?.Metadata?.Id, nameof(document), "Document, its Metadata nor its Id can't be null."))
    {
        Document = Guard.NotNull(document, nameof(document));
        ConditionResultType = conditionResultType;
    }

    /// <inheritdoc />
    public override string ToString()
        => $"{base.ToString()} with Document of {Document.GetType()}";
}

/// <summary>Content was filtered out because DSL expression in its <see cref="IFilterTemplate.Condition" /> field didn't pass.</summary>
public sealed class FilteredContent<TDocument> : Content<TDocument>
    where TDocument : class, IDocument
{
    /// <summary>Gets <see cref="DocumentStatus.Filtered" /> status.</summary>
    public override DocumentStatus Status => DocumentStatus.Filtered;

    /// <summary>Gets the metadata of document which is filtered out.</summary>
    public override IDocumentMetadata Metadata { get; }

    /// <summary>Creates a new instance.</summary>
    public FilteredContent(IDocumentMetadata metadata)
        : base(Guard.NotNull(metadata?.Id, nameof(metadata), "Metadata nor its Id can't be null."))
        => Metadata = Guard.NotNull(metadata, nameof(metadata));
}

/// <summary>Content was not found in Sitecore.</summary>
public sealed class NotFoundContent<TDocument> : Content<TDocument>
    where TDocument : class, IDocument
{
    /// <summary>Gets <see cref="DocumentStatus.NotFound" /> status.</summary>
    public override DocumentStatus Status => DocumentStatus.NotFound;

    /// <summary>Gets <c>null</c> because nothing was found.</summary>
    public override IDocumentMetadata? Metadata => null;

    /// <summary>Creates a new instance.</summary>
    public NotFoundContent(DocumentId id)
        : base(id) { }
}

/// <summary>Content which wasn't loaded because there were errors when fetching it from Sitecore, deserializing, evaluating for this request etc.</summary>
public sealed class InvalidContent<TDocument> : Content<TDocument>
    where TDocument : class, IDocument
{
    /// <summary>Gets <see cref="DocumentStatus.Invalid" /> status.</summary>
    public override DocumentStatus Status => DocumentStatus.Invalid;

    /// <summary>Gets the metadata of invalid document or <c>null</c> if failed to load any document.</summary>
    public override IDocumentMetadata? Metadata { get; }

    /// <summary>Gets the errors describing why the content is invalid.</summary>
    public IReadOnlyList<TrimmedRequiredString> Errors { get; }

    /// <summary>Creates a new instance.</summary>
    public InvalidContent(DocumentId id, IDocumentMetadata? metadata, params TrimmedRequiredString[] errors)
        : this(id, metadata, (IEnumerable<TrimmedRequiredString>)errors) { }

    /// <summary>Creates a new instance.</summary>
    public InvalidContent(DocumentId id, IDocumentMetadata? metadata, IEnumerable<TrimmedRequiredString> errors)
        : base(id)
    {
        Errors = Guard.NotEmptyNorNullItems(errors?.ToArray().AsReadOnly(), nameof(errors));
        Metadata = metadata == null || id.Equals(metadata.Id) // Metadata.Id can be null because it can be a mock
            ? metadata
            : throw new ArgumentException($"If metadata are specified then their Id must equal to explicit 'id' argument but it's {metadata.Id.Dump()} vs. {id}.",
                nameof(metadata));
    }

    /// <inheritdoc />
    public override string ToString()
        => $"{base.ToString()} with Errors: {Errors.ToDebugString()}";
}
