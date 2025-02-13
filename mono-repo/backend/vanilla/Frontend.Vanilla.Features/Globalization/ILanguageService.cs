using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;

namespace Frontend.Vanilla.Features.Globalization;

/// <summary>
/// Resolves allowed language from the configuration according to current context (HTTP request, user) and given criteria.
/// </summary>
public interface ILanguageService
{
    /// <summary>Gets a language from <see cref="Allowed" /> corresponding to <see cref="CultureInfo.CurrentCulture" />. Throws if nothing found.</summary>
    [DelegateTo(typeof(ICurrentLanguageResolver), nameof(ICurrentLanguageResolver.Language))]
    LanguageInfo Current { get; }

    /// <summary>Gets the default language for this web app.</summary>
    [DelegateTo(typeof(IGlobalizationConfiguration), nameof(IGlobalizationConfiguration.DefaultLanguage))]
    LanguageInfo Default { get; }

    /// <summary>Gets whether to use browser language for this web app.</summary>
    [DelegateTo(typeof(IGlobalizationConfiguration), nameof(IGlobalizationConfiguration.UseBrowserLanguage))]
    bool UseBrowserLanguage { get; }

    /// <summary>Gets the browser default culture for this web app without checking against Allowed languages.</summary>
    [DelegateTo(typeof(IBrowserLanguageResolver), nameof(IBrowserLanguageResolver.DefaultCulture))]
    string? BrowserPreferredCulture { get; }

    /// <summary>Gets allowed languages for current context (user, public/internal access).</summary>
    [DelegateTo(typeof(IAllowedLanguagesResolver), nameof(IAllowedLanguagesResolver.Languages))]
    IReadOnlyList<LanguageInfo> Allowed { get; }

    /// <summary>Finds a language from <see cref="Allowed" /> by its name.</summary>
    [DelegateTo(typeof(ILanguageByNameResolver), nameof(ILanguageByNameResolver.Resolve))]
    LanguageInfo? FindByName(string? name);

    /// <summary>
    /// Finds the language corresponding to user's claims.
    /// Returns null and logs error if there is no/invalid claim or it doesn't correspond to allowed language.
    /// </summary>
    [DelegateTo(typeof(ILanguageByUserClaimsResolver), nameof(ILanguageByUserClaimsResolver.Resolve))]
    LanguageInfo? FindByUserClaims();
}
