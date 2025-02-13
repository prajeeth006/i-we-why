using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Content.ContentServiceImpl;

/// <summary>
/// Implementation of <see cref="IContentService.Get{TDocument}(DocumentId, ContentLoadOptions)" />.
/// </summary>
internal interface IGetDocumentCommand
{
    Task<TDocument> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument;

    Task<TDocument> GetRequiredAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument;
}

internal sealed class GetDocumentCommand(IGetContentCommand getItemCommand, ILogger<GetDocumentCommand> log) : IGetDocumentCommand
{
    public Task<TDocument> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument
        => GetInternalAsync<TDocument>(mode, id, options, false);

    public Task<TDocument> GetRequiredAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument
        => GetInternalAsync<TDocument>(mode, id, options, true);

    private async Task<TDocument> GetInternalAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options, bool isRequired)
        where TDocument : class, IDocument
    {
        var content = await getItemCommand.GetAsync<TDocument>(mode, id, options);

        switch (content)
        {
            case SuccessContent<TDocument> successContent:
                return successContent.Document;

            case InvalidContent<TDocument> invalidContent:
                var errors = invalidContent.Errors.ToDebugString();

                if (isRequired)
                    throw new Exception($"Failed to load content {content.Id} because it has errors: {errors}");

                log.LogError("Failed to load content with {id} because it has {errors}", content.Id, errors);

                return null;

            case NotFoundContent<TDocument> _:
            case FilteredContent<TDocument> _:
                return !isRequired
                    ? null
                    : throw new Exception(
                        $"Failed to load content {content.Id} because it's required (must exist) but it's {content.Status}. {ContentLoadOptions.Disclaimer}");

            default:
                throw new InvalidOperationException();
        }
    }
}
