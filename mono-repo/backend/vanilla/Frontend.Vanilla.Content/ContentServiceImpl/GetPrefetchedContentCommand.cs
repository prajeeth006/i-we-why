using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Content.ContentServiceImpl;

/// <summary>
/// Implementation of <see cref="IContentService.GetContent{TDocument}" />.
/// </summary>
internal interface IGetPrefetchedContentCommand
{
    Task<IEnumerable<Content<TDocument>>> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument;
}

internal sealed class GetPrefetchedContentCommand(IPrefetchedContentLoader loader) : IGetPrefetchedContentCommand
{
    public async Task<IEnumerable<Content<TDocument>>> GetAsync<TDocument>(ExecutionMode mode, DocumentId id, ContentLoadOptions options)
        where TDocument : class, IDocument
    {
        Guard.NotNull(id, nameof(id));

        var content = await loader.GetContentAsync(mode, id, options, trace: null);
        return content.Select(c =>
        {
            switch (c)
            {
                case Content<TDocument> typedContent: // Avoid unnecessary allocation if IDocument requested, most common call esp. from IClientContentService
                    return typedContent;

                case SuccessContent<IDocument> successContent:
                    if (successContent.Document is TDocument typedDocument)
                        return new SuccessContent<TDocument>(typedDocument);

                    var error = $"Actual document is {successContent.Document.GetType()} but incompatible {typeof(TDocument)} was requested.";

                    return new InvalidContent<TDocument>(successContent.Id, successContent.Document.Metadata, error);

                case FilteredContent<IDocument> filteredContent:
                    return new FilteredContent<TDocument>(filteredContent.Metadata);

                case NotFoundContent<IDocument> notFoundContent:
                    return new NotFoundContent<TDocument>(notFoundContent.Id);

                case InvalidContent<IDocument> invalidContent:
                    return new InvalidContent<TDocument>(invalidContent.Id, invalidContent.Metadata, invalidContent.Errors);

                default:
                    throw new VanillaBugException();
            }
        });
    }
}
