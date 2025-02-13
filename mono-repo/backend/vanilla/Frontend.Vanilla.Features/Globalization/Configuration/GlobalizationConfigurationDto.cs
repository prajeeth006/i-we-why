using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.Core.Validation.Annotations;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Globalization.Configuration;

internal sealed class GlobalizationConfigurationDto
{
    [Required]
    public string DefaultCultureName { get; set; } = string.Empty;

    public string? SearchEngineCultureName { get; set; }

    [Required, NotEmptyCollection, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public List<string> AllowedCultureNames { get; set; } = new ();

    [Required, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public List<string> OfflineCultureNames { get; set; } = new ();

    [Required, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public List<string> HiddenCultureNames { get; set; } = new ();

    [Required, RequiredItems, UniqueItems(StringComparison.OrdinalIgnoreCase)]
    public List<string> InternalCultureNames { get; set; } = new ();

    [Required, NotEmptyCollection, RequiredKeys, RequiredValues]
    public Dictionary<string, LanguageInfoDto> CultureMapping { get; set; } = new ();

    /// <summary>
    /// The collection of overrides of the CultureInfo as a dictionary of culture names and override JSONs.
    /// The override defined for a culture and all the overrides defined for its parents (if any) will be
    /// merged together with the most specific culture having the highest priority.
    /// </summary>
    [Required, RequiredKeys, RequiredValues]
    public Dictionary<string, JObject> CultureOverrides { get; set; } = new ();

    [Required]
    public bool UseBrowserLanguage { get; set; } = false;
}

internal sealed class LanguageInfoDto
{
    public string? NativeName { get; set; }
    public string? RouteValue { get; set; }
    public string? SitecoreContentLanguage { get; set; }
    public string? SitecoreContentDefaultLanguage { get; set; }
    public string? HtmlLangAttribute { get; set; }
    public string? AngularLocale { get; set; }
}
