using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Loading.Caching;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Loading.JustInTime;

internal sealed class JustInTimePrefetchedContentLoader(ICachedContentLoader cachedLoader, IContentRequestFactory requestFactory) : IPrefetchedContentLoader
{
    public async Task<IReadOnlyList<Content<IDocument>>> GetContentAsync(ExecutionMode mode, DocumentId id, ContentLoadOptions options, Action<object> trace)
    {
        trace?.Invoke($"Loading {id} with following options.");
        trace?.Invoke(options);

        var request = requestFactory.Create(id, options.PrefetchDepth, options.BypassCache, options.Revision, options.BypassPrefetchedProcessing, options.BypassChildrenCache);
        trace?.Invoke("Determined following details of the request to Sitecore");
        trace?.Invoke(request);

        var cached = await cachedLoader.GetContentsAsync(mode, request, trace);

        if (options.BypassPrefetchedProcessing)
        {
            return cached.PrefetchedContent.Select(x => x.Content).ToList();
        }

        List<Content<IDocument>> contentList = new List<Content<IDocument>>();
        var contentLoader = new JustInTimeContentLoader(cachedLoader, requestFactory);
        foreach (var processor in cached.JustInTimeProcessors)
        {
            foreach (var c in cached.PrefetchedContent)
            {
                var content = c.Content;
                if (content is SuccessContent<IDocument> successContent)
                    content = await processor.ProcessAsync(mode, successContent, options, contentLoader, trace);

                contentList.Add(content);
            }
        }
        return contentList;
    }
}
