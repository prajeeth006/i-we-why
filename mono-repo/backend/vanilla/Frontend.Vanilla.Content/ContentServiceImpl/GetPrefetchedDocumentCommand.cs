using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.ContentServiceImpl;

/// <summary>
/// Implementation of <see cref="IContentService.Get{TDocument}(DocumentId, ContentLoadOptions)" />.
/// </summary>
internal interface IGetPrefetchedDocumentCommand
{
    Task<IReadOnlyList<TDocument>> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument;
}

internal sealed class GetPrefetchedDocumentCommand(IGetPrefetchedContentCommand getItemCommand, ILogger<GetPrefetchedDocumentCommand> log) : IGetPrefetchedDocumentCommand
{
    public Task<IReadOnlyList<TDocument>> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument
        => GetInternalAsync<TDocument>(mode, id, options, false);

    private async Task<IReadOnlyList<TDocument>> GetInternalAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options, bool isRequired)
        where TDocument : class, IDocument
    {
        var content = await getItemCommand.GetAsync<TDocument>(mode, id, options);

        return content.Select(c =>
        {
            switch (c)
            {
                case SuccessContent<TDocument> successContent:
                    return successContent.Document;

                case InvalidContent<TDocument> invalidContent:
                    var errors = invalidContent.Errors.ToDebugString();

                    if (isRequired)
                        throw new Exception($"Failed to load content {c.Id} because it has errors: {errors}");

                    log.LogError("Failed to load content with {id} because it has {errors}", c.Id, errors);

                    return null;

                case NotFoundContent<TDocument> _:
                case FilteredContent<TDocument> _:
                    return !isRequired
                        ? null
                        : throw new Exception(
                            $"Failed to load content {c.Id} because it's required (must exist) but it's {c.Status}. {ContentLoadOptions.Disclaimer}");

                default:
                    throw new InvalidOperationException();
            }
        }).ToList();
    }
}
