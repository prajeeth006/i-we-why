#nullable enable

using System.Globalization;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Content.DataSources;

/// <summary>
/// Resolves language parameters for requests to Sitecore REST service.
/// </summary>
internal interface ISitecoreLanguageResolver
{
    SitecoreLanguages ResolveLanguages(CultureInfo documentIdCulture);
}

internal sealed class SitecoreLanguages(TrimmedRequiredString contentLanguage, TrimmedRequiredString? contentDefaultLanguage, TrimmedRequiredString urlLanguage)
{
    public TrimmedRequiredString ContentLanguage { get; } = contentLanguage;
    public TrimmedRequiredString? ContentDefaultLanguage { get; } = contentDefaultLanguage;
    public TrimmedRequiredString UrlLanguage { get; } = urlLanguage;
}

/// <summary>
/// Resolves Sitecore language parameters from given culture in a simple way.
/// See WebSitecoreLanguageResolver which is the main implementation.
/// </summary>
internal sealed class DefaultSitecoreLanguageResolver : ISitecoreLanguageResolver
{
    public SitecoreLanguages ResolveLanguages(CultureInfo documentIdCulture)
        => new SitecoreLanguages(
            contentLanguage: GetBaseCultureName(documentIdCulture),
            contentDefaultLanguage: null,
            urlLanguage: documentIdCulture.TwoLetterISOLanguageName);

    /// <summary>en-US => en, en-GB => en, de-AT => de, nb-NO => nb, nn-NO => nn.</summary>
    private static string GetBaseCultureName(CultureInfo culture)
    {
        while (!CultureInfo.InvariantCulture.Equals(culture.Parent))
            culture = culture.Parent;

        return culture.Name.ToLowerInvariant();
    }
}
