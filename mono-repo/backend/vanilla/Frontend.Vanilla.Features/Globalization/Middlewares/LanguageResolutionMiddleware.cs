using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Globalization.Configuration;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Globalization.Middlewares;

/// <summary>
/// Resolves language for the HTTP request and based on it either sets it up, rediretcs or responds with not-found.
/// </summary>
internal sealed class LanguageResolutionMiddleware(
    RequestDelegate next,
    IGlobalizationConfiguration config,
    ICultureUrlTokenResolver cultureUrlTokenResolver,
    IUserPreferredLanguageResolver userPreferredLanguageResolver,
    IAllowedLanguagesResolver allowedLanguagesResolver,
    IEndpointMetadata endpointMetadata,
    IInternalRequestEvaluator internalRequestEvaluator)
    : WebAbstractions.Middleware(next)
{
    public override Task InvokeAsync(HttpContext httpContext)
    {
        var (urlToken, urlTokenSource) = cultureUrlTokenResolver.GetToken(httpContext);

        if (urlTokenSource == null)
            return InvokeNextAsync(userPreferredLanguageResolver.Resolve(), httpContext);

        var urlLanguage = FindByUrlToken(allowedLanguagesResolver.Languages, urlToken);

        if (urlLanguage != null)
            return InvokeNextAsync(urlLanguage, httpContext);

        if (endpointMetadata.Contains<ServesHtmlDocumentAttribute>())
        {
            if (FindByUrlToken(config.HiddenLanguages, urlToken) != null)
                return RedirectToDefaultLanguageAsync(httpContext, permanent: false, nameof(config.HiddenLanguages));
            if (FindByUrlToken(config.OfflineLanguages, urlToken) != null)
                return RedirectToDefaultLanguageAsync(httpContext, permanent: true, nameof(config.OfflineLanguages));

            throw new Exception("This route serving HTML document should not match. Did you (product developer, not Vanilla) miss to put CultureRouteConstraint on it?");
        }

        httpContext.Response.StatusCode = StatusCodes.Status404NotFound;

        if (internalRequestEvaluator.IsInternal())
        {
            var message = $"There is unsupported '{RouteValueKeys.Culture}' token in {urlTokenSource} with value {urlToken.Dump()}."
                          + $" Configured allowed route values (cultures) for current context: {allowedLanguagesResolver.Languages.Select(l => $"'{l.RouteValue}' ({l})").Join()}.";

            return httpContext.WriteResponseAsync(ContentTypes.Text, message);
        }

        return Task.CompletedTask;
    }

    private Task InvokeNextAsync(LanguageInfo language, HttpContext httpContext)
    {
        CultureInfoHelper.SetCurrent(language.Culture);

        return Next(httpContext);
    }

    private Task RedirectToDefaultLanguageAsync(HttpContext httpContext, bool permanent, string redirectSource)
    {
        var url = cultureUrlTokenResolver.GetUrlWithCultureToken(httpContext, config.DefaultLanguage.RouteValue);
        httpContext.Response.Redirect(url.PathAndQuery, $"{typeof(VisitorSettingsCultureMiddleware)} -> {redirectSource}", permanent);

        return Task.CompletedTask;
    }

    private static LanguageInfo? FindByUrlToken(IEnumerable<LanguageInfo> languages, string? urlToken)
        => languages.FirstOrDefault(l => l.RouteValue.EqualsIgnoreCase(urlToken));
}
