#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Loading;

/// <summary>
/// Processes a content before it's cached.
/// Therefore the processing must use only passed parameters. It can't be related to context (user, HTTP context etc).
/// If some further processing with actual context after cache retrieval is needed then <see cref="IJustInTimeContentProcessor" /> should be added.
/// </summary>
public interface IPreCachingContentProcessor
{
    /// <summary>Processes the content - see interface description.</summary>
    Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ICollection<IJustInTimeContentProcessor> justInTimeProcessors,
        Action<object>? trace);
}

internal abstract class SyncPreCachingContentProcessor : IPreCachingContentProcessor
{
    Task<Content<IDocument>> IPreCachingContentProcessor.ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ICollection<IJustInTimeContentProcessor> justInTimeProcessors,
        Action<object>? trace)
    {
        var result = Process(content, justInTimeProcessors, trace);

        return Task.FromResult(result);
    }

    public abstract Content<IDocument> Process(
        SuccessContent<IDocument> content,
        ICollection<IJustInTimeContentProcessor> justInTimeProcessors,
        Action<object>? trace);
}
