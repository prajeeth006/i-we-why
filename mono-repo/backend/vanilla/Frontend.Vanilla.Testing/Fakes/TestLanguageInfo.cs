#nullable enable

using System;
using System.Globalization;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestLanguageInfo
{
    public static LanguageInfo Get(
        string? culture = null,
        string? routeValue = null,
        string? nativeName = null,
        string? sitecoreContentLanguage = null,
        Tuple<string>? sitecoreContentDefaultLanguage = null,
        string? htmlLangAttribute = null,
        string? angularLocale = null)
    {
        var cultureObj = culture != null ? new CultureInfo(culture) : TestCulture.GetRandom();
        var randomStr = $"{cultureObj.Name.ToLower()}-{RandomGenerator.GetInt32()}";

        return new LanguageInfo(
            cultureObj,
            nativeName ?? $"Native name {randomStr}",
            routeValue ?? $"rv-{randomStr}",
            sitecoreContentLanguage ?? $"sc-{randomStr}",
            sitecoreContentDefaultLanguage != null ? sitecoreContentDefaultLanguage.Item1 : RandomGenerator.GetBoolean() ? $"sc-def-{randomStr}" : null,
            htmlLangAttribute ?? $"html-{randomStr}",
            angularLocale ?? $"ang-{randomStr}");
    }
}
