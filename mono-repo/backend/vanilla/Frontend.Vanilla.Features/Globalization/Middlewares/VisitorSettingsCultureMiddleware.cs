using System.Globalization;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.Middlewares;

/// <summary>
/// Sets up language for particular user (hidden languages are user-specific) based on HTTP request.
/// </summary>
internal sealed class VisitorSettingsCultureMiddleware(
    RequestDelegate next,
    IVisitorSettingsManager visitorSettingsManager,
    IEndpointMetadata endpointMetadata,
    ICookieHandler cookieHandler)
    : BeforeNextMiddleware(next)
{
    public override void BeforeNext(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            return;

        var currentCulture = CultureInfo.CurrentCulture.Name;
        var settings = visitorSettingsManager.Current;

        if (settings.CultureName?.Value != currentCulture)
        {
            visitorSettingsManager.Current = settings.With(cultureName: currentCulture);
            cookieHandler.Set(CookieConstants.IsLanguageChanged, (settings.CultureName != null).ToString().ToLower());
        }
    }
}
