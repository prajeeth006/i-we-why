using System.Collections.Generic;
using System.Linq;

#pragma warning disable 1591
namespace Frontend.Vanilla.Features.MetaTags;

/// <summary>
/// SEO configuration of meta tags (explicit overrides).
/// </summary>
public interface IMetaTagsConfiguration
{
    IReadOnlyList<PageMetaTagsRule> PageMetaTags { get; }
    IReadOnlyList<GlobalMetaTagsRule> GlobalMetaTags { get; }
}

public sealed class PageMetaTagsRule(
    string urlPath,
    IEnumerable<KeyValuePair<string, string>> urlQueryParams,
    string? title,
    IEnumerable<KeyValuePair<string, string>> tags)
{
    public string UrlPath { get; } = urlPath;
    public IReadOnlyDictionary<string, string> UrlQueryParams { get; } = urlQueryParams.ToDictionary();
    public string? Title { get; } = title;
    public IReadOnlyDictionary<string, string> Tags { get; } = tags.ToDictionary();
}

public sealed class GlobalMetaTagsRule(string ruleName, IEnumerable<KeyValuePair<string, string>> tags, IEnumerable<string> urlPathAndQueryRegexes)
{
    public string RuleName { get; } = ruleName;
    public IReadOnlyDictionary<string, string> Tags { get; } = tags.ToDictionary();
    public IReadOnlyList<string> UrlPathAndQueryRegexes { get; } = urlPathAndQueryRegexes.ToList();
}

internal sealed class MetaTagsConfiguration(IReadOnlyList<PageMetaTagsRule> pageMetaTags, IReadOnlyList<GlobalMetaTagsRule> globalMetaTags)
    : IMetaTagsConfiguration
{
    public IReadOnlyList<PageMetaTagsRule> PageMetaTags { get; } = pageMetaTags;
    public IReadOnlyList<GlobalMetaTagsRule> GlobalMetaTags { get; } = globalMetaTags;
}
#pragma warning restore 1591
