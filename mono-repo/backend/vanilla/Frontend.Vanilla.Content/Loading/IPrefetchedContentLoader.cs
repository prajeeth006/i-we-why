#nullable enable

using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Content.Loading;

/// <summary>
/// Central low-level component for loading content items from Sitecore.
/// Usually you should use more convenient <see cref="IContentService" />.
/// </summary>
public interface IPrefetchedContentLoader
{
    /// <summary>Loads the content from Sitecore.</summary>
    Task<IReadOnlyList<Content<IDocument>>> GetContentAsync(
        ExecutionMode mode,
        DocumentId id,
        ContentLoadOptions options,
        Action<object>? trace);
}
