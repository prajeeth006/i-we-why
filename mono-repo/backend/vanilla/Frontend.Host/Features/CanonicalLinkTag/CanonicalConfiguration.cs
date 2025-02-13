using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Validation.Annotations;
using JetBrains.Annotations;

namespace Frontend.Host.Features.CanonicalLinkTag;

internal interface ICanonicalConfiguration
{
    /// <summary>Gets the query strings that should be kept in canonical.</summary>
    IReadOnlyList<string> QueryStringsToKeep { get; }

    /// <summary>Collection of rules that define mapping from input URL to canonical URL (more specific rules first as they are processed top-down).</summary>
    IDictionary<string, CanonicalUrlRule> UrlRegexRules { get; }
}

internal sealed class CanonicalConfiguration : ICanonicalConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Seo.Canonical";

    [Required, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public IReadOnlyList<string> QueryStringsToKeep { get; set; } = Array.Empty<string>();

    [Required, RequiredKeys, UniqueKeys(StringComparison.OrdinalIgnoreCase)]
    public IDictionary<string, CanonicalUrlRule> UrlRegexRules { get; set; } = new Dictionary<string, CanonicalUrlRule>();
}

internal class CanonicalUrlRule
{
    public Regex HostAndPathRegex { get; }

    public string? CanonicalUrl { get; }

    public CanonicalUrlRule([RegexPattern] string hostAndPathRegex, string? canonicalUrl)
    {
        HostAndPathRegex = ValidateHostAndPathRegex(hostAndPathRegex, canonicalUrl);
        CanonicalUrl = ValidateCanonicalUrl(canonicalUrl);
    }

    private static Regex ValidateHostAndPathRegex(string hostAndPathRegex, string? canonicalUrl)
    {
        if (string.IsNullOrWhiteSpace(hostAndPathRegex))
            throw new ArgumentException($"Missing HostAndPathRegex in the rule with CanonicalUrl '{canonicalUrl}'.");
        if (!hostAndPathRegex.StartsWith("^") || !hostAndPathRegex.EndsWith("$"))
            throw new ArgumentException($"HostAndPathRegex '{hostAndPathRegex}' must match full input (start with caret ^ and end with dollar $)"
                                        + " because HostAndPath must be fully replaced by CanonicalUrl which starts with scheme HTTP(S) to get a valid URL.");

        try
        {
            return new Regex(hostAndPathRegex, RegexOptions.Compiled | RegexOptions.IgnoreCase);
        }
        catch (Exception ex)
        {
            throw new ArgumentException($"HostAndPathRegex '{hostAndPathRegex}' isn't a valid regular expression: {ex.Message}");
        }
    }

    private static string? ValidateCanonicalUrl(string? canonicalUrl)
    {
        if (canonicalUrl == null)
            return null;

        if (!TrimmedRequiredString.IsValid(canonicalUrl))
            throw new ArgumentException($"CanonicalUrl '{canonicalUrl}' must be a trimmed non-empty string.");

        var replacedString = Regex.Replace(canonicalUrl, @"\$\d+", "validation");

        return Uri.TryCreate(replacedString, UriKind.Absolute, out var replacedUrl) && replacedUrl.IsHttp()
            ? canonicalUrl
            : throw new ArgumentException(
                $"CanonicalUrl '{canonicalUrl}' after replacement of all placeholders ($1, $2...) must result in a valid HTTP(S) URL e.g. https://www.bwin.com/en/page.");
    }
}
