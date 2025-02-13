#nullable enable

using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Central service for loading the content in a convenient way.
/// </summary>
public interface IContentService
{
    /// <summary>
    /// Gets strongly-typed content. It never throws, doesn't log any error. Everything is up to the consumer.
    /// We strongly recommend to at least log <see cref="InvalidContent{TDocument}.Errors" /> if the content is <see cref="InvalidContent{TDocument}" />.
    /// </summary>
    [DelegateTo(typeof(IGetContentCommand), nameof(IGetContentCommand.GetAsync))]
    Content<TDocument> GetContent<TDocument>(DocumentId id, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets strongly-typed content. It never throws, doesn't log any error. Everything is up to the consumer.
    /// We strongly recommend to at least log <see cref="InvalidContent{TDocument}.Errors" /> if the content is <see cref="InvalidContent{TDocument}" />.
    /// </summary>
    [DelegateTo(typeof(IGetContentCommand), nameof(IGetContentCommand.GetAsync))]
    Task<Content<TDocument>> GetContentAsync<TDocument>(DocumentId id, CancellationToken cancellationToken, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the document of successfully loaded content item. It never throws.
    /// It logs <see cref="InvalidContent{TDocument}.Errors" /> if the content is <see cref="InvalidContent{TDocument}" />.
    /// It just returns null if the content is <see cref="NotFoundContent{TDocument}" /> or <see cref="FilteredContent{TDocument}" />.
    /// </summary>
    [DelegateTo(typeof(IGetDocumentCommand), nameof(IGetDocumentCommand.GetAsync))]
    TDocument? Get<TDocument>(DocumentId id, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the document of successfully loaded content item. It never throws.
    /// It logs <see cref="InvalidContent{TDocument}.Errors" /> if the content is <see cref="InvalidContent{TDocument}" />.
    /// It just returns null if the content is <see cref="NotFoundContent{TDocument}" /> or <see cref="FilteredContent{TDocument}" />.
    /// </summary>
    [DelegateTo(typeof(IGetDocumentCommand), nameof(IGetDocumentCommand.GetAsync))]
    Task<TDocument?> GetAsync<TDocument>(DocumentId id, CancellationToken cancellationToken, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the document of successfully loaded content item. It throws an exception if the content is
    /// <see cref="InvalidContent{TDocument}" />, <see cref="NotFoundContent{TDocument}" /> or <see cref="FilteredContent{TDocument}" />.
    /// </summary>
    [DelegateTo(typeof(IGetDocumentCommand), nameof(IGetDocumentCommand.GetRequiredAsync))]
    TDocument GetRequired<TDocument>(DocumentId id, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the document of successfully loaded content item. It throws an exception if the content is
    /// <see cref="InvalidContent{TDocument}" />, <see cref="NotFoundContent{TDocument}" /> or <see cref="FilteredContent{TDocument}" />.
    /// </summary>
    [DelegateTo(typeof(IGetDocumentCommand), nameof(IGetDocumentCommand.GetRequiredAsync))]
    Task<TDocument> GetRequiredAsync<TDocument>(DocumentId id, CancellationToken cancellationToken, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the documents of successfully loaded content items of specified IDs. No nulls are returned.
    /// Only documents of requested type are returned, others are treated as <see cref="InvalidContent{TDocument}" />.
    /// If a content is <see cref="InvalidContent{TDocument}" /> or <see cref="NotFoundContent{TDocument}" /> then an error is logged and it's skipped.
    /// <see cref="FilteredContent{TDocument}" /> is just skipped.
    /// </summary>
    [DelegateTo(typeof(IGetDocumentsCommand), nameof(IGetDocumentsCommand.GetDocuments))]
    IEnumerable<TDocument> Get<TDocument>(IEnumerable<DocumentId> ids, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the documents of successfully loaded content items of specified IDs.
    /// No nulls are returned. This method never throws, errors are written to the log.
    /// Only documents of requested type are returned, others are treated as <see cref="InvalidContent{TDocument}" />.
    /// If a content is <see cref="InvalidContent{TDocument}" /> or <see cref="NotFoundContent{TDocument}" /> then an error is logged and it's skipped.
    /// <see cref="FilteredContent{TDocument}" /> is just skipped.
    /// </summary>
    [DelegateTo(typeof(IGetDocumentsCommand), nameof(IGetDocumentsCommand.GetDocumentsAsync))]
    Task<IReadOnlyList<TDocument>> GetAsync<TDocument>(IEnumerable<DocumentId> ids, CancellationToken cancellationToken, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets children of specified parent content item using <see cref="Get{TDocument}(IEnumerable{DocumentId}, ContentLoadOptions)" /> method.
    /// No nulls are returned. This method never throws, errors are written to the log.
    /// <see cref="NotFoundContent{IDocument}" /> parent is considered to be an error because we can't load any children.
    /// <see cref="FilteredContent{IDocument}" /> parent means that all children are automatically filtered.
    /// <see cref="InvalidContent{IDocument}" /> parent is treated same as <see cref="SuccessContent{IDocument}" /> because children were requested, not parent with its errors.
    /// </summary>
    [DelegateTo(typeof(IGetChildrenCommand), nameof(IGetChildrenCommand.GetByParentId))]
    IEnumerable<TDocument> GetChildren<TDocument>(DocumentId parentId, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets children of specified parent content item using <see cref="Get{TDocument}(IEnumerable{DocumentId}, ContentLoadOptions)" /> method.
    /// No nulls are returned. This method never throws, errors are written to the log.
    /// <see cref="NotFoundContent{IDocument}" /> parent is considered to be an error because we can't load any children.
    /// <see cref="FilteredContent{IDocument}" /> parent means that all children are automatically filtered.
    /// <see cref="InvalidContent{IDocument}" /> parent is treated same as <see cref="SuccessContent{IDocument}" /> because children were requested, not parent with its errors.
    /// </summary>
    [DelegateTo(typeof(IGetChildrenCommand), nameof(IGetChildrenCommand.GetByParentIdAsync))]
    Task<IReadOnlyList<TDocument>> GetChildrenAsync<TDocument>(DocumentId parentId, CancellationToken cancellationToken, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the documents specified by <see cref="IDocumentMetadata.ChildIds" /> of given <paramref name="parent" />
    /// using <see cref="Get{TDocument}(IEnumerable{DocumentId}, ContentLoadOptions)" /> method.
    /// </summary>
    [DelegateTo(typeof(IGetChildrenCommand), nameof(IGetChildrenCommand.GetByParentDocument))]
    IEnumerable<TDocument> GetChildren<TDocument>(IDocument parent, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>
    /// Gets the documents specified by <see cref="IDocumentMetadata.ChildIds" /> of given <paramref name="parent" />
    /// using <see cref="Get{TDocument}(IEnumerable{DocumentId}, ContentLoadOptions)" /> method.
    /// </summary>
    [DelegateTo(typeof(IGetChildrenCommand), nameof(IGetChildrenCommand.GetByParentDocumentAsync))]
    Task<IReadOnlyList<TDocument>> GetChildrenAsync<TDocument>(IDocument parent, CancellationToken cancellationToken, ContentLoadOptions options = default)
        where TDocument : class, IDocument;

    /// <summary>Gets the value of a content string field. It can't be null nor white-space. In case of an error it throws an exception.</summary>
    [DelegateTo(typeof(IGetRequiredStringCommand), nameof(IGetRequiredStringCommand.GetAsync))]
    RequiredString GetRequiredString<TDocument>(DocumentId id, Expression<Func<TDocument, string?>> stringSelector)
        where TDocument : class, IDocument;

    /// <summary>Gets the value of a content string field. It can't be null nor white-space. In case of an error it throws an exception.</summary>
    [DelegateTo(typeof(IGetRequiredStringCommand), nameof(IGetRequiredStringCommand.GetAsync))]
    Task<RequiredString> GetRequiredStringAsync<TDocument>(DocumentId id, Expression<Func<TDocument, string?>> stringSelector, CancellationToken cancellationToken)
        where TDocument : class, IDocument;
}
