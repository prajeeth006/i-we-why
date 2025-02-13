using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.Middlewares;

internal sealed class LanguageCookieMiddleware(RequestDelegate next, IEndpointMetadata endpointMetadata, ICookieHandler cookieHandler, ILanguageService languageService)
    : BeforeNextMiddleware(next)
{
    public override void BeforeNext(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
            return;

        var currentCookie = cookieHandler.GetValue(CookieConstants.Lang);
        var currentLang = languageService.Current.RouteValue;

        if (currentCookie != currentLang)
            cookieHandler.Set(CookieConstants.Lang, currentLang);
    }
}
