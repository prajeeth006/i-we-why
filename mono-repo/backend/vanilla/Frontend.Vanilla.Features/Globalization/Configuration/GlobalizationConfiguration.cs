using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Features.Globalization.Configuration;

/// <summary>
/// Globalization configuration for web application.
/// </summary>
internal interface IGlobalizationConfiguration
{
    LanguageInfo DefaultLanguage { get; }
    LanguageInfo? SearchEngineLanguage { get; }
    bool UseBrowserLanguage { get; }
    IReadOnlyList<LanguageInfo> AllowedLanguages { get; }
    IReadOnlyList<LanguageInfo> OfflineLanguages { get; }
    IReadOnlyList<LanguageInfo> HiddenLanguages { get; }
    IReadOnlyList<LanguageInfo> InternalLanguages { get; }
}

internal sealed class GlobalizationConfiguration(
    LanguageInfo defaultLanguage,
    LanguageInfo? searchEngineLanguage,
    bool useBrowserLanguage,
    IEnumerable<LanguageInfo> allowedLanguages,
    IEnumerable<LanguageInfo> offlineLanguages,
    IEnumerable<LanguageInfo> hiddenLanguages,
    IEnumerable<LanguageInfo> internalLanguages)
    : IGlobalizationConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.Globalization";

    public LanguageInfo DefaultLanguage { get; } = defaultLanguage;
    public LanguageInfo? SearchEngineLanguage { get; } = searchEngineLanguage;
    public bool UseBrowserLanguage { get; } = useBrowserLanguage;
    public IReadOnlyList<LanguageInfo> AllowedLanguages { get; } = allowedLanguages.ToArray();
    public IReadOnlyList<LanguageInfo> OfflineLanguages { get; } = offlineLanguages.ToArray();
    public IReadOnlyList<LanguageInfo> HiddenLanguages { get; } = hiddenLanguages.ToArray();
    public IReadOnlyList<LanguageInfo> InternalLanguages { get; } = internalLanguages.ToArray();
}
