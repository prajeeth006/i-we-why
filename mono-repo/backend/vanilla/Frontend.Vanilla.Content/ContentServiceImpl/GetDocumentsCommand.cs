using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.ContentServiceImpl;

/// <summary>
/// Methods of <see cref="IContentService" /> for loading multiple documents by ids.
/// </summary>
internal interface IGetDocumentsCommand
{
    IEnumerable<TDocument> GetDocuments<TDocument>(IEnumerable<DocumentId> ids, ContentLoadOptions options)
        where TDocument : class, IDocument;

    Task<IReadOnlyList<TDocument>> GetDocumentsAsync<TDocument>(IEnumerable<DocumentId> ids, CancellationToken cancellationToken, ContentLoadOptions options)
        where TDocument : class, IDocument;
}

internal sealed class GetDocumentsCommand(IGetContentCommand getItemCommand, ILogger<GetDocumentsCommand> log) : IGetDocumentsCommand
{
    // Result must be lazily enumerated
    IEnumerable<TDocument> IGetDocumentsCommand.GetDocuments<TDocument>(IEnumerable<DocumentId> ids, ContentLoadOptions options)
        => GetDocumentsAsync<TDocument>(ExecutionMode.Sync, ids, options)
            .Select(t => ExecutionMode.ExecuteSync(t))
            .Where(d => d != null);

    async Task<IReadOnlyList<TDocument>> IGetDocumentsCommand.GetDocumentsAsync<TDocument>(
        IEnumerable<DocumentId> ids,
        CancellationToken cancellationToken,
        ContentLoadOptions options)
    {
        var documents = await Task.WhenAll(GetDocumentsAsync<TDocument>(ExecutionMode.Async(cancellationToken), ids, options));

        return documents.Where(d => d != null).ToList();
    }

    private IEnumerable<Task<TDocument>> GetDocumentsAsync<TDocument>(ExecutionMode mode, IEnumerable<DocumentId> ids, ContentLoadOptions options)
        where TDocument : class, IDocument
        => ids.Select(async id =>
        {
            var content = await getItemCommand.GetAsync<TDocument>(mode, id, options);

            switch (content)
            {
                case SuccessContent<TDocument> successContent:
                    return successContent.Document;

                case InvalidContent<TDocument> invalidContent:
                    log.LogError(
                        "Failed to load content {itemId} with {itemGuid} referred from collection of ids (most likely ChildIds) because it has errors: {errors}. Called from: {caller}",
                        content.Id.Path,
                        content.Id.Id,
                        invalidContent.Errors.ToDebugString(),
                        CallerInfo.Get());

                    return null;

                case NotFoundContent<TDocument> _:
                    log.LogWarning(
                        "Content {itemId} with {itemGuid} was not found despite it was referred from a collection of ids (most likely ChildIds). Called from: {caller}",
                        content.Id.Path,
                        content.Id.Id,
                        CallerInfo.Get());

                    return null;

                case FilteredContent<TDocument> _:
                    return null; // Feature: filtered from result collection without any error

                default:
                    throw new InvalidOperationException();
            }
        });
}
