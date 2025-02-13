using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Content.Loading.Deserialization;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Loading.Caching;

/// <summary>
/// Processes success content using all <see cref="IPreCachingContentProcessor" />-s before is is cached.
/// </summary>
internal interface IPreCachingContentLoader
{
    [NotNull, ItemNotNull]
    Task<WithPrefetched<CachedContent>> GetContentsAsync(ExecutionMode mode, [NotNull] ContentRequest request, [CanBeNull] Action<object> trace);
}

internal sealed class PreCachingContentLoader(IDeserializationContentLoader deserializationLoader, IEnumerable<IPreCachingContentProcessor> preCachingProcessors)
    : IPreCachingContentLoader
{
    private readonly IReadOnlyList<IPreCachingContentProcessor> preCachingProcessors = preCachingProcessors.ToArray();

    public async Task<WithPrefetched<CachedContent>> GetContentsAsync(ExecutionMode mode, ContentRequest request, Action<object> trace)
    {
        var unprocessed = await deserializationLoader.GetContentsAsync(mode, request, trace);
        CachedContent[] processedPrefetched = [];

        // Run all in parallel
        var processedRequestedTask = ProcessContentAsync(mode, unprocessed.Requested, trace);
        if (request.BypassContentProcessors)
        {
            processedPrefetched = unprocessed.Prefetched.Select(x => new CachedContent(x)).ToArray();
        }
        else
        {
            processedPrefetched = await Task.WhenAll(unprocessed.Prefetched.ConvertAll(c => ProcessContentAsync(mode, c, trace)));
        }
        var processedRequested = await processedRequestedTask;

        return new WithPrefetched<CachedContent>(processedRequested, processedPrefetched, unprocessed.RelativeExpiration);
    }

    public async Task<CachedContent> ProcessContentAsync(ExecutionMode mode, Content<IDocument> content, Action<object> trace)
    {
        var justInTimeProcessors = new List<IJustInTimeContentProcessor>();

        foreach (var processor in preCachingProcessors)
        {
            if (content is SuccessContent<IDocument> successContent)
                content = await processor.ProcessAsync(mode, successContent, justInTimeProcessors, trace);
            else
                break;
        }

        return new CachedContent(content, justInTimeProcessors);
    }
}
