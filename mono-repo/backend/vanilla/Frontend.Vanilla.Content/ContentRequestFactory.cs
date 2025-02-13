#nullable enable

using System;
using System.Linq;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Content;

/// <summary>
/// Resolves <see cref="ContentRequest" /> for requested content.
/// </summary>
internal interface IContentRequestFactory
{
    ContentRequest Create(DocumentId id, uint prefetchDepth = 0, bool bypassCache = false, string revisionNumber = "", bool bypassContentProcessors = false, bool bypassPrefetchedCache = false);
}

internal sealed class ContentRequestFactory(
    IContentConfiguration config,
    ISitecoreLanguageResolver langResolver,
    IEditorOverridesResolver editorOverridesResolver,
    IDocumentIdFactory documentIdFactory,
    ISmartUrlReplacementResolver smartUrlReplacementResolver)
    : IContentRequestFactory
{
    public ContentRequest Create(DocumentId id, uint prefetchDepth, bool bypassCache, string revision, bool bypassContentProcessors, bool bypassPrefetchedCache)
    {
        var normalizedId = id.PathRelativity == DocumentPathRelativity.AbsoluteRoot
            ? documentIdFactory.Create(id.Path, id.Culture)
            : id;
        var langs = langResolver.ResolveLanguages(id.Culture);
        var editorOverrides = editorOverridesResolver.Resolve();
        var smartUrlOverrides = smartUrlReplacementResolver.Resolve();
        var usePreview = config.ForcePreview || editorOverrides.UsePreview;
        var useCache = config.CacheTimes.Default > TimeSpan.Zero && !bypassCache && !editorOverrides.NoCache && !config.ItemPathDisplayModeEnabled;

        // DON'T CHANGE -> WOULD BREAK DISTRIBUTED CACHE KEYS!!!
        var itemUrl = new UriBuilder(usePreview ? config.PreviewHost : config.Host)
            .AppendPathSegment(config.Version.ToLowerInvariant())
            .If(id.PathRelativity == DocumentPathRelativity.ConfiguredRootNode, b => b.AppendPathSegment(config.RootNodePath.ToLowerInvariant()))
            .AppendPathSegment(id.Path + ".aspx")
            .AddQueryParametersIfValueNotWhiteSpace(
                ("xml", "1"),
                ("sc_lang", langs.ContentLanguage),
                ("defaultLang", langs.ContentDefaultLanguage?.Value),
                ("url_lang", langs.UrlLanguage),
                ("sc_mode", usePreview ? "preview" : "normal"),
                ("sc_nocache", useCache ? null : "true"),
                ("sc_date", editorOverrides.PreviewDate?.Value.ToString("yyyyMMddTHHmmssZ")),
                ("env", config.Environment),
                ("culture", id.Culture.Name.ToLowerInvariant()))
            .AddQueryParametersIfValueNotWhiteSpace(smartUrlOverrides.Select(item => ("smartUrlOverride", (string?)item)))
            .If(!string.IsNullOrWhiteSpace(revision), b => b.AddQueryParameters(("revision", revision)))
            .GetHttpUri();

        return new ContentRequest(itemUrl, normalizedId, langs, editorOverrides, prefetchDepth, useCache, bypassContentProcessors, bypassPrefetchedCache);
    }
}
