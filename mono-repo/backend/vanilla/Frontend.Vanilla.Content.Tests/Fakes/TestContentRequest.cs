using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Content.Tests.Fakes;

internal static class TestContentRequest
{
    public static ContentRequest Get(
        DocumentId id = null,
        EditorOverrides editorOverrides = null,
        string url = "http://sitecore/content",
        uint prefetchDepth = 66,
        bool useCache = true,
        bool bypassContentProcessors = false,
        bool bypassPrefetchedCache = false)
        => new ContentRequest(
            new HttpUri(url),
            id ?? TestDocumentId.Get(),
            new SitecoreLanguages("x", "y", "z"),
            editorOverrides ?? new EditorOverrides(),
            prefetchDepth,
            useCache,
            bypassContentProcessors,
            bypassPrefetchedCache);
}
