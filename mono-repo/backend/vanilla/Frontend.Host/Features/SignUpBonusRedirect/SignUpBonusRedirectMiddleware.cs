using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.SignUpBonusRedirect;

internal sealed class SignUpBonusRedirectMiddleware(
    RequestDelegate next,
    IEndpointMetadata endpointMetadata,
    ISignUpBonusResolver signUpBonusResolver,
    ISignUpBonusRedirectConfiguration config,
    ICookieHandler cookieHandler,
    ISitecoreLinkUrlProvider sitecoreLinkUrlProvider,
    ILogger<SignUpBonusRedirectMiddleware> log)
    : Middleware(next)
{
    public const string SuppressBonus = "sb";

    public override Task InvokeAsync(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || string.IsNullOrWhiteSpace(config.LandingPageLinkLocation)) return Next(httpContext);

        var bonusFlowContent = signUpBonusResolver.Try(r => r.GetBonusContentFlow(false), log);

        if (bonusFlowContent?.TrackerId == null) return Next(httpContext);

        var landingPageLink = bonusFlowContent.CampaignFlowDetails == null
            ? config.LandingPageLinkLocation
            : config.AlternateRedirectionLink;
        var landingPageUrl = sitecoreLinkUrlProvider.GetUrl(landingPageLink);

        if (IsAlreadyOnLandingPage(httpContext.Request.GetFullUrl(), landingPageUrl)) return Next(httpContext);

        if (httpContext.Request.Query[SuppressBonus] != "1") return RedirectToLandingPageAsync(httpContext, landingPageUrl);

        cookieHandler.Set(
            CookieConstants.SuppressBonusRedirect,
            bonusFlowContent.TrackerId.ToString()!,
            new CookieSetOptions()
            {
                MaxAge = TimeSpan.FromDays(365 * 10),
                HttpOnly = true,
            });

        return Next(httpContext);
    }

    private static bool IsAlreadyOnLandingPage(Uri requestUrl, Uri landingPageUrl)
        => requestUrl.HasEqualComponents(landingPageUrl, UriComponents.Host | UriComponents.Path); // Scheme differs because of load balancer

    private static Task RedirectToLandingPageAsync(HttpContext httpContext, Uri landingPageUrl)
    {
        var builder = new UriBuilder(landingPageUrl);

        var withReferrer = httpContext.Request.QueryString.Add("referer", httpContext.Request.GetFullUrl().ToString());
        builder.Query = withReferrer.Value;
        httpContext.Response.Redirect(builder.Uri.AbsoluteUri.Replace("??", "?"), false); // remove Replace once switched to .net core there Query has only one ?

        return Task.CompletedTask;
    }
}
