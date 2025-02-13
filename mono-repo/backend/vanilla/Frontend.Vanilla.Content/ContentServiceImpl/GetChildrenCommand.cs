using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.ContentServiceImpl;

/// <summary>
/// Methods of <see cref="IContentService" /> for loading child documents by parent.
/// </summary>
internal interface IGetChildrenCommand
{
    IEnumerable<TDocument> GetByParentId<TDocument>(DocumentId parentId, ContentLoadOptions options)
        where TDocument : class, IDocument;

    Task<IReadOnlyList<TDocument>> GetByParentIdAsync<TDocument>(DocumentId parentId, CancellationToken cancellationToken, ContentLoadOptions options)
        where TDocument : class, IDocument;

    IEnumerable<TDocument> GetByParentDocument<TDocument>(IDocument parent, ContentLoadOptions options)
        where TDocument : class, IDocument;

    Task<IReadOnlyList<TDocument>> GetByParentDocumentAsync<TDocument>(IDocument parent, CancellationToken cancellationToken, ContentLoadOptions options)
        where TDocument : class, IDocument;
}

internal sealed class GetChildrenCommand(IGetContentCommand getItemCommand, IGetPrefetchedDocumentCommand getPrefetchedDocumentCommand, IGetDocumentsCommand getDocumentsCommand, ILogger<GetChildrenCommand> log)
    : IGetChildrenCommand
{
    IEnumerable<TDocument> IGetChildrenCommand.GetByParentId<TDocument>(DocumentId parentId, ContentLoadOptions options)
    {
        var childIds = ExecutionMode.ExecuteSync(GetChildIdsAsync, parentId, options);

        return childIds != null
            ? getDocumentsCommand.GetDocuments<TDocument>(childIds, options)
            : Array.Empty<TDocument>();
    }

    async Task<IReadOnlyList<TDocument>> IGetChildrenCommand.GetByParentIdAsync<TDocument>(
        DocumentId parentId,
        CancellationToken cancellationToken,
        ContentLoadOptions options)
    {
        if (options.BypassChildrenCache)
        {
            return await getPrefetchedDocumentCommand.GetAsync<TDocument>(ExecutionMode.Async(cancellationToken), parentId, options);
        }

        var childIds = await GetChildIdsAsync(ExecutionMode.Async(cancellationToken), parentId, options);

        return childIds != null
            ? await getDocumentsCommand.GetDocumentsAsync<TDocument>(childIds, cancellationToken, options)
            : Array.Empty<TDocument>();
    }

    IEnumerable<TDocument> IGetChildrenCommand.GetByParentDocument<TDocument>(IDocument parent, ContentLoadOptions options)
    {
        Guard.NotNull(parent, nameof(parent));

        return getDocumentsCommand.GetDocuments<TDocument>(parent.Metadata.ChildIds, options);
    }

    Task<IReadOnlyList<TDocument>> IGetChildrenCommand.GetByParentDocumentAsync<TDocument>(
        IDocument parent,
        CancellationToken cancellationToken,
        ContentLoadOptions options)
    {
        Guard.NotNull(parent, nameof(parent));

        return getDocumentsCommand.GetDocumentsAsync<TDocument>(parent.Metadata.ChildIds, cancellationToken, options);
    }

    [ItemCanBeNull]
    private async Task<IEnumerable<DocumentId>> GetChildIdsAsync(ExecutionMode mode, DocumentId parentId, ContentLoadOptions options)
    {
        Guard.NotNull(parentId, nameof(parentId));

        var parentOptions = new ContentLoadOptions { PrefetchDepth = Math.Max(1, options.PrefetchDepth) };
        var parent = await getItemCommand.GetAsync<IDocument>(mode, parentId, parentOptions);

        switch (parent.Status)
        {
            case DocumentStatus.Success:
            case DocumentStatus.Invalid: // As good as Success because children were requested, regardless of parent's errors
                return parent.Metadata?.ChildIds.Any() == true
                    ? parent.Metadata.ChildIds
                    : null;

            case DocumentStatus.Filtered:
                return null; // Feature: all children should be filtered with no error

            case DocumentStatus.NotFound:
                log.LogError(
                    "Parent content with {parentId} was not found therefore can't get its children."
                    + "Either create it or change your code to get it as optional using dedicated call to IContentService. Called from: {caller}",
                    parentId,
                    CallerInfo.Get());

                return null;

            default:
                throw parent.Status.GetInvalidException();
        }
    }
}
