using Frontend.Vanilla.Features.Visitor;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

/// <summary>
/// Tries to resolve user's preferred language first from the cookies if he already visited our website. Then from his browser settings.
/// </summary>
internal interface IVisitorSettingsLanguageResolver
{
    LanguageInfo? Resolve();
}

internal sealed class VisitorSettingsLanguageResolver(ILanguageService languageService, IVisitorSettingsManager settingsManager) : IVisitorSettingsLanguageResolver
{
    public LanguageInfo? Resolve()
        => languageService.FindByName(settingsManager.Received.CultureName?.Value);
}
