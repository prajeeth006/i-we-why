using System;
using System.Globalization;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class CultureDslProvider(
    ILanguageService languageService,
    IBrowserLanguageResolver browserLanguageResolver,
    IVisitorSettingsLanguageResolver visitorSettingsLanguageResolver)
    : ICultureDslProvider
{
    public string Default
        => ToDslString(languageService.Default)!;

    public string GetAllowed()
        => languageService.Allowed.Select(ToDslString).Join();

    public string Current
        => CultureInfo.CurrentCulture.Name;

    public string? GetFromClaims()
        => ToDslString(languageService.FindByUserClaims());

    public string? GetFromBrowser()
        => ToDslString(browserLanguageResolver.Resolve());

    public string? GetFromPreviousVisit()
        => ToDslString(visitorSettingsLanguageResolver.Resolve());

    public string GetUrlToken(string cultureName)
    {
        var language = languageService.Allowed.FirstOrDefault(l => ToDslString(l)?.EqualsIgnoreCase(cultureName) is true);

        return language?.RouteValue ?? throw new Exception(
            $"Failed to find culture by name {cultureName.Dump()} from allowed configured cultures: {languageService.Allowed.Join()}.");
    }

    private static string? ToDslString(LanguageInfo? language)
        => language?.Culture.Name;
}
