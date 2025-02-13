#nullable enable

using System;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Content;

/// <summary>
/// All details needed to make a REST request to fetch content from Sitecore service.
/// </summary>
internal sealed class ContentRequest
{
    public HttpUri ItemUrl { get; }
    public DocumentId Id { get; }
    public SitecoreLanguages Languages { get; }
    public EditorOverrides EditorOverrides { get; }
    public uint PrefetchDepth { get; }
    public bool UseCache { get; }
    public bool BypassContentProcessors { get; }
    public bool BypassChildrenCache { get; }

    public ContentRequest(HttpUri itemUrl, DocumentId id, SitecoreLanguages languages, EditorOverrides editorOverrides, uint prefetchDepth, bool useCache, bool bypassContentProcessors = false, bool bypassChildrenCache = false)
    {
        const string depthMessage = "URL can't be null and can't contain depth query parameter because it must identify a single item.";
        ItemUrl = Guard.Requires(itemUrl, u => u != null && !u.Query.Contains("depth", StringComparison.OrdinalIgnoreCase), nameof(itemUrl), depthMessage);
        Id = id;
        Languages = languages;
        EditorOverrides = editorOverrides;
        PrefetchDepth = prefetchDepth;
        UseCache = useCache;
        BypassContentProcessors = bypassContentProcessors;
        BypassChildrenCache = bypassChildrenCache;
    }
}
