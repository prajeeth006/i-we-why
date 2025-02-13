#nullable disable

using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Frontend.Vanilla.Core.Validation.Annotations;
using JetBrains.Annotations;

namespace Frontend.Host.Features.SeoTracking;

/// <summary>
/// Configuration of SEO tracking feature.
/// </summary>
internal interface ISeoTrackingConfiguration
{
    string WmidCookieName { get; }
    string LandingUrlCookieName { get; }

    [CanBeNull]
    Regex ExcludeCurrentUrlRegex { get; }

    [CanBeNull]
    Regex ExcludeReferrerRegex { get; }

    IReadOnlyList<ISearchEngine> SearchEngines { get; }
    IReadOnlyList<IWmidRule> Wmids { get; }
}

internal interface ISearchEngine
{
    string Name { get; }
    Regex ReferrerRegex { get; }
}

internal interface IWmidRule
{
    string Wmid { get; }

    [CanBeNull]
    string SearchEngine { get; }

    [CanBeNull]
    string CultureName { get; }

    [CanBeNull]
    string CountryCode { get; set; }
}

internal sealed class SeoTrackingConfigurationDto
{
    [RequiredString]
    public string WmidCookieName { get; set; }

    [RequiredString]
    public string LandingUrlCookieName { get; set; }

    [CanBeNull, NotEmptyNorWhiteSpace]
    public string ExcludeCurrentUrlRegex { get; set; }

    [CanBeNull, NotEmptyNorWhiteSpace]
    public string ExcludeReferrerRegex { get; set; }

    [Required, RequiredKeys]
    public Dictionary<string, string> SearchEngineReferrerRegexes { get; set; }

    [Required, RequiredKeys]
    public Dictionary<string, string> Wmids { get; set; }
}

internal sealed class SeoTrackingConfiguration : ISeoTrackingConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Seo.Tracking";

    public string WmidCookieName { get; set; }
    public string LandingUrlCookieName { get; set; }
    public Regex ExcludeCurrentUrlRegex { get; set; }
    public Regex ExcludeReferrerRegex { get; set; }
    public IReadOnlyList<ISearchEngine> SearchEngines { get; set; }
    public IReadOnlyList<IWmidRule> Wmids { get; set; }
}

internal sealed class SearchEngine : ISearchEngine
{
    public string Name { get; set; }
    public Regex ReferrerRegex { get; set; }
}

internal sealed class WmidRule : IWmidRule
{
    public string Wmid { get; set; }
    public string SearchEngine { get; set; }
    public string CultureName { get; set; }
    public string CountryCode { get; set; }
}
