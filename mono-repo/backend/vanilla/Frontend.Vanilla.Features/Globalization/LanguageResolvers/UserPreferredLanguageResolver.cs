using Frontend.Vanilla.Features.Globalization.Configuration;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

internal interface IUserPreferredLanguageResolver
{
    LanguageInfo Resolve();
}

internal sealed class UserPreferredLanguageResolver(
    IGlobalizationConfiguration config,
    IVisitorSettingsLanguageResolver visitorSettingsLanguageResolver,
    IBrowserLanguageResolver browserLanguageResolver,
    IRobotLanguageResolver robotLanguageResolver)
    : IUserPreferredLanguageResolver
{
    public LanguageInfo Resolve()
        => robotLanguageResolver.Resolve()
           ?? visitorSettingsLanguageResolver.Resolve()
           ?? browserLanguageResolver.Resolve()
           ?? config.DefaultLanguage;
}
