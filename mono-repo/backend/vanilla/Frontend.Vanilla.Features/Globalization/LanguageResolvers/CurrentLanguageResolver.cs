using System;
using System.Globalization;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Features.Globalization.Configuration;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Implementation of <see cref="ILanguageService.Current" />.
/// </summary>
internal interface ICurrentLanguageResolver
{
    LanguageInfo Language { get; }
}

internal sealed class CurrentLanguageResolver(IAllowedLanguagesResolver allowedLanguagesResolver, IGlobalizationConfiguration globalizationConfiguration)
    : ICurrentLanguageResolver
{
    public LanguageInfo Language
    {
        get
        {
            var currentCulture = string.IsNullOrEmpty(CultureInfo.CurrentCulture.Name)
                ? globalizationConfiguration.DefaultLanguage.ToString()
                : CultureInfo.CurrentCulture.Name;
            var currentLanguage = allowedLanguagesResolver.Languages.FirstOrDefault(l => l.Culture.Name == currentCulture);

            return currentLanguage ?? throw new InvalidOperationException($"Current culture '{currentCulture}' is NOT within range of configured"
                                                                          + $" allowed cultures: {allowedLanguagesResolver.Languages.Join()}."
                                                                          + " Most likely some consumer code set it therefore overwrote culture resolved by Vanilla or the resolution wasn't executed yet.");
        }
    }
}
