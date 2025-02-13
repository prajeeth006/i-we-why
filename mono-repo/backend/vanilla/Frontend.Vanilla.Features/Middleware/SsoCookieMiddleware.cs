using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Claims;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Middleware;

internal sealed class SsoCookieMiddleware(RequestDelegate next, IEndpointMetadata endpointMetadata, ICookieHandler cookieHandler)
    : BeforeNextMiddleware(next)
{
    public override void BeforeNext(HttpContext httpContext)
    {
        if (!endpointMetadata.Contains<ServesHtmlDocumentAttribute>() || httpContext.User.Identity.IsNotLoggedIn())
            return;

        var ssoToken = httpContext.User.FindValue(PosApiClaimTypes.SsoToken);

        if (ssoToken.IsNullOrWhiteSpace())
            throw new Exception($"Cannot set requested 'sso' cookie because missing claim '{PosApiClaimTypes.SsoToken}' despite user is authenticated.");

        cookieHandler.Set(LoginCookies.SsoToken, ssoToken, new CookieSetOptions { HttpOnly = true });
    }
}
