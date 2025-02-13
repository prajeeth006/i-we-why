#nullable enable

using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Loading;

/// <summary>
/// Processes a content just-in-time when it's being loaded for particular context (user, HTTP context etc).
/// It's added to particular content by <see cref="IPreCachingContentProcessor" />.
/// </summary>
public interface IJustInTimeContentProcessor
{
    /// <summary>Processes the content - see interface description.</summary>
    Task<Content<IDocument>> ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object>? trace);
}

internal abstract class SyncJustInTimeContentProcessor : IJustInTimeContentProcessor
{
    Task<Content<IDocument>> IJustInTimeContentProcessor.ProcessAsync(
        ExecutionMode mode,
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object>? trace)
    {
        var result = Process(content, options, loader, trace);

        return Task.FromResult(result);
    }

    public abstract Content<IDocument> Process(
        SuccessContent<IDocument> content,
        ContentLoadOptions options,
        IContentLoader loader,
        Action<object>? trace);
}
