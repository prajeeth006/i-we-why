using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Loading.JustInTime;

internal sealed class JustInTimeContentLoader(ICachedContentLoader cachedLoader, IContentRequestFactory requestFactory) : IContentLoader
{
    public async Task<Content<IDocument>> GetContentAsync(ExecutionMode mode, DocumentId id, ContentLoadOptions options, Action<object> trace)
    {
        trace?.Invoke($"Loading {id} with following options.");
        trace?.Invoke(options);

        var request = requestFactory.Create(id, options.PrefetchDepth, options.BypassCache, options.Revision, options.BypassPrefetchedProcessing, options.BypassChildrenCache);
        trace?.Invoke("Determined following details of the request to Sitecore");
        trace?.Invoke(request);

        var cached = await cachedLoader.GetContentsAsync(mode, request, trace);
        var content = cached.Content;

        foreach (var processor in cached.JustInTimeProcessors)
        {
            if (content is SuccessContent<IDocument> successContent)
                content = await processor.ProcessAsync(mode, successContent, options, this, trace);
            else
                break;
        }

        return content;
    }
}
