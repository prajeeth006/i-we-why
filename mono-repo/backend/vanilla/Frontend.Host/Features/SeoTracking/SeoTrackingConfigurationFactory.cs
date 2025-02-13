#nullable disable
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Validation;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;

namespace Frontend.Host.Features.SeoTracking;

/// <summary>
/// Factory for creating <see cref="SeoTrackingConfiguration" /> from <see cref="SeoTrackingConfigurationDto" /> by converting and validating values.
/// </summary>
internal sealed class SeoTrackingConfigurationFactory : SimpleConfigurationFactory<ISeoTrackingConfiguration, SeoTrackingConfigurationDto>
{
    public override ISeoTrackingConfiguration Create(SeoTrackingConfigurationDto dto)
    {
        var config = new SeoTrackingConfiguration();
        var errors = new List<ValidationResult>();

        config.WmidCookieName = ParseName(dto.WmidCookieName, errors, "WmidCookieName");
        config.LandingUrlCookieName = ParseName(dto.LandingUrlCookieName, errors, "LandingUrlCookieName");
        config.ExcludeCurrentUrlRegex = dto.ExcludeCurrentUrlRegex != null ? CreateRegex(dto.ExcludeCurrentUrlRegex, errors, "ExcludeCurrentUrlRegex") : null;
        config.ExcludeReferrerRegex = dto.ExcludeReferrerRegex != null ? CreateRegex(dto.ExcludeReferrerRegex, errors, "ExcludeReferrerRegex") : null;

        config.SearchEngines = dto.SearchEngineReferrerRegexes
            .Select(e => new SearchEngine
            {
                Name = ParseName(e.Key, errors, "SearchEngineReferrerRegexes", "key in SearchEngineReferrerRegexes"),
                ReferrerRegex = CreateRegex(e.Value, errors, "SearchEngineReferrerRegexes", $"SearchEngineReferrerRegexes['{e.Key}']"),
            })
            .ToArray().AsReadOnly();

        config.Wmids = dto.Wmids
            .Select(w => ParseWmid(w, errors, dto.SearchEngineReferrerRegexes.Keys))
            .OrderByDescending(w => w.SearchEngine != null) // More specific rules should be first
            .ThenByDescending(w => w.CountryCode != null && w.CultureName != null)
            .ThenByDescending(w => w.CountryCode != null)
            .ThenByDescending(w => w.CultureName != null)
            .ToArray().AsReadOnly();

        return errors.Count == 0
            ? config
            : throw new InvalidConfigurationException(errors);
    }

    private static IWmidRule ParseWmid(KeyValuePair<string, string> wmid, ICollection<ValidationResult> errors, IEnumerable<string> searchEngineNames)
    {
        var result = new WmidRule { Wmid = wmid.Value };

        if (string.IsNullOrWhiteSpace(wmid.Value))
            errors.Add($"Wmids['{wmid.Key}'] can't be null nor white-space.", "Wmids");

        var match = Regex.Match(wmid.Key, $@"^{SearchEnginePattern}(?:\|{CulturePattern})?(?:\|{CountryPattern})?$");

        if (!match.Success)
        {
            errors.Add($"Invalid key in entry {wmid} in Wmids. Valid examples: 'Google', 'Google|en-US', 'Google|en-US|AT', '*|en-US', '*|en-US|AT', '*'.", "Wmids");

            return result;
        }

        result.SearchEngine = match.Groups["searchEngine"].Value;
        if (result.SearchEngine == "*")
            result.SearchEngine = null;
        else if (!searchEngineNames.Contains(result.SearchEngine))
            errors.Add($"Search engine '{result.SearchEngine}' of entry {wmid} in Wmids doesn't correspond to any of SearchEngineReferrerRegexes.", "Wmids");

        var cultureMatch = match.Groups["culture"];

        if (cultureMatch.Value == "*")
            result.CultureName = null;
        else
        {
            result.CultureName = cultureMatch.Success ? CultureInfoHelper.Find(cultureMatch.Value)?.Name : null;
            if (result.CultureName == null && cultureMatch.Success)
                errors.Add($"Culture '{cultureMatch.Value}' of entry {wmid} in Wmids is not a supported .NET culture.", "Wmids");
        }

        var countryMatch = match.Groups["country"];

        if (countryMatch.Value == "*")
            result.CountryCode = null;
        else
        {
            result.CountryCode = countryMatch.Success ? countryMatch.Value : null;
            if (result.CountryCode == null && countryMatch.Success)
                errors.Add($"Country code '{result.CountryCode}' of entry {wmid} in Wmids is not a two-letter country code.", "Wmids");
        }

        return result;
    }

    private const string NamePattern = @"[\w-]+";
    private static readonly string SearchEnginePattern = $@"(?<searchEngine>{NamePattern}|\*)";
    private const string CulturePattern = @"(?<culture>\w+-\w+|\*)";
    private const string CountryPattern = @"(?<country>\w\w|\*)";

    private static string ParseName(string value, ICollection<ValidationResult> errors, string propertyName, string origin = null)
    {
        if (!Regex.IsMatch(value, $"^{NamePattern}$"))
            errors.Add($"Invalid {origin ?? propertyName} = '{value}'. It must consist only of letters, numbers, underscores or dashes.", propertyName);

        return value;
    }

    private static Regex CreateRegex(string pattern, ICollection<ValidationResult> errors, string propertyName, string origin = null)
    {
        if (string.IsNullOrWhiteSpace(pattern))
        {
            errors.Add($"Regular expression {origin ?? propertyName} can't be empty nor white-space to express your intentions explicitly.", propertyName);

            return null;
        }

        try
        {
            return new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
        }
        catch (Exception ex)
        {
            errors.Add($"Value '{pattern}' used in {origin ?? propertyName} is not valid regular expression because: {ex.Message}", propertyName);

            return null;
        }
    }
}
