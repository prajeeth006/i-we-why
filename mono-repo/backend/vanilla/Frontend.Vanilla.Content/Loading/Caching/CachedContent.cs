using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Loading.Caching;

/// <summary>
/// Cached user-agnostic content to be evaluated just-in-time.
/// </summary>
internal sealed class CachedContent([NotNull] Content<IDocument> content, [ItemNotNull] IEnumerable<IJustInTimeContentProcessor> justInTimeProcessors = null, IReadOnlyList<CachedContent> prefetchedContent = null)
{
    public Content<IDocument> Content { get; } = Guard.NotNull(content, nameof(content));
    public IReadOnlyList<CachedContent> PrefetchedContent { get; set; } = prefetchedContent;
    public IReadOnlyList<IJustInTimeContentProcessor> JustInTimeProcessors { get; } = justInTimeProcessors != null && content is SuccessContent<IDocument>
        ? Guard.NotNullItems(justInTimeProcessors.ToArray(), nameof(justInTimeProcessors))
        : Array.Empty<IJustInTimeContentProcessor>();

    // If not success -> no more processing needed
}
