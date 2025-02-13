#nullable enable

using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.Client.Infrastructure;

internal interface IClientContentRegionalResolver
{
    IEnumerable<DocumentId> Resolve(IEnumerable<KeyValuePair<string, DocumentId>> regionItems);
}

internal sealed class ClientContentRegionalResolver(IContentRegionResolver contentRegionResolver) : IClientContentRegionalResolver
{
    private const string Wildcard = "*";

    public IEnumerable<DocumentId> Resolve(IEnumerable<KeyValuePair<string, DocumentId>> regionItems)
    {
        var language = contentRegionResolver.GetCurrentLanguageCode() ?? Wildcard;
        var country = contentRegionResolver.GetUserCountryCode() ?? Wildcard;

        return regionItems
            .Select(i => new { Parameters = ParseKey(i.Key), value = i.Value })
            .Where(x => Match(x.Parameters.Language, language) && Match(x.Parameters.Country, country))
            .Select(x => x.value);
    }

    private (string Language, string Country) ParseKey(string key)
    {
        var parts = key.Split('|');

        return (parts[0], parts.Length > 1 ? parts[1] : Wildcard);
    }

    private static bool Match(string value, string expected)
        => value == Wildcard || value.EqualsIgnoreCase(expected);
}

internal interface IContentRegionResolver
{
    string? GetUserCountryCode();
    string? GetCurrentLanguageCode();
}

internal sealed class StaticContentRegionResolver : IContentRegionResolver
{
    public string? GetUserCountryCode()
        => new RegionInfo(CultureInfo.CurrentCulture.LCID).TwoLetterISORegionName;

    public string? GetCurrentLanguageCode()
        => CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
}
