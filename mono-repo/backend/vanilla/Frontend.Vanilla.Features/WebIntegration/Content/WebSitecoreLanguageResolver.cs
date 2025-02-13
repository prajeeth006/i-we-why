using System;
using System.Globalization;
using System.Linq;
using Frontend.Vanilla.Content.DataSources;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Features.Globalization;

namespace Frontend.Vanilla.Features.WebIntegration.Content;

/// <summary>
/// Resolves Sitecore language parameters according to configured languages for the web application.
/// Result is cached because it's resolved too many times - for each content item but it doesn't change even if user changes.
/// </summary>
internal sealed class WebSitecoreLanguageResolver(ILanguageService languageService, ICurrentContextAccessor currentContextAccessor) : ISitecoreLanguageResolver
{
    private const string FeatureName = "VanillaFramework.Web.Globalization";

    public SitecoreLanguages ResolveLanguages(CultureInfo documentIdCulture)
        => currentContextAccessor.Items.GetOrAddFromFactory("Van:SitecoreLangs:" + documentIdCulture, _ => ResolveFreshLanguages(documentIdCulture));

    private SitecoreLanguages ResolveFreshLanguages(CultureInfo culture)
    {
        var language = languageService.Allowed.FirstOrDefault(l => l.Culture.Equals(culture));

        if (language == null)
            throw new InvalidOperationException(
                $"Unable to determine language for Sitecore request from culture '{culture}' specified in DocumentId"
                + $" because it's not within allowed cultures for current context (according to config {FeatureName}, user, HTTP request...): {languageService.Allowed.Join()}."
                + $" DocumentId either received the culture explicitly specified or it was taken from current culture which is '{CultureInfo.CurrentCulture}'."
                + " Vanilla automatically resolves and sets current culture only to allowed one at the beginning of the request. Investigate who/what/when provides this culture and fix it."
                + " If it's some custom thread/task then make sure the culture is correctly propagated from parent context that has correct culture (usually associated with HttpRequest)."
                + " Called from: " + CallerInfo.Get());

        return new SitecoreLanguages(language.SitecoreContentLanguage, language.SitecoreContentDefaultLanguage, language.RouteValue);
    }
}
