using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Implements <see cref="ILanguageService.FindByUserClaims" />.
/// </summary>
internal interface ILanguageByUserClaimsResolver
{
    LanguageInfo? Resolve();
}

internal sealed class LanguageByUserClaimsResolver(
    IGlobalizationConfiguration config,
    ICurrentUserAccessor currentUserAccessor,
    ILogger<LanguageByUserClaimsResolver> log)
    : ILanguageByUserClaimsResolver
{
    public LanguageInfo? Resolve()
    {
        var claimValue = currentUserAccessor.User.FindValue(PosApiClaimTypes.CultureName);
        // Do not search internal nor hidden languages because they are not supported on backend thus should not be in claims
        var language = config.AllowedLanguages.FirstOrDefault(l => l.Culture.Name.EqualsIgnoreCase(claimValue));

        if (language == null)
            log.LogError("{claimType} of the {user} contains {culture} which is not within configured in {featureName} -> {allowedLanguages}."
                         + " Most likely the user was migrated from another label or the culture was decommissioned."
                         + " Fix the user on backend side or reconfigure the cultures (according to business needs)",
                PosApiClaimTypes.CultureName,
                currentUserAccessor.User.Identity?.Name,
                claimValue,
                GlobalizationConfiguration.FeatureName,
                config.AllowedLanguages.Join());

        return language;
    }
}
