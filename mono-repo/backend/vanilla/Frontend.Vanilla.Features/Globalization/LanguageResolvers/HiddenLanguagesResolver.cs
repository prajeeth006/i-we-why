using System.Collections.Generic;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Resolves languages that should be hidden for current user
/// that means all configured hidden languages except language set in his claims.
/// </summary>
internal interface IHiddenLanguagesResolver
{
    IEnumerable<LanguageInfo> Resolve();
}

internal sealed class HiddenLanguagesResolver(
    IGlobalizationConfiguration config,
    ICurrentUserAccessor currentUserAccessor,
    ILanguageByUserClaimsResolver languageByUserClaimsResolver)
    : IHiddenLanguagesResolver
{
    public IEnumerable<LanguageInfo> Resolve()
    {
        if (config.HiddenLanguages.Count == 0) // Most likely code path
            yield break;

        var userLang = currentUserAccessor.User.Identity?.IsAuthenticated is true ? languageByUserClaimsResolver.Resolve() : null;

        foreach (var lang in config.HiddenLanguages)
            if (userLang == null || !lang.Equals(userLang))
                yield return lang;
    }
}
