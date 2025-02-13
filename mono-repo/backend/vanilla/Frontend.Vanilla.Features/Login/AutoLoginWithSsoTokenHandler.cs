using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login;

internal sealed class AutoLoginWithSsoTokenHandler(
    IWebAuthenticationService webAuthenticationService,
    INativeAppService nativeAppService,
    ICookieHandler cookieHandler,
    ILogger<AutoLoginWithSsoTokenHandler> logger)
    : IAutoLoginHandler
{
    public const string QueryKey = "_sso";
    public const string LoginTypeQueryKey = "_logintype";
    public const string TerminalIdQueryKey = "terminalId";
    public const string ShopIdQueryKey = "shopId";

    public IReadOnlyList<TrimmedRequiredString> UsedQueryKeys { get; }
        = new TrimmedRequiredString[] { QueryKey };

    public Task? TryLoginAsync(HttpRequest request, CancellationToken cancellationToken)
    {
        var urlQuery = request.Query;
        var ssoToken = request.Headers.ContainsKey(HttpHeaders.Sso)
            ? request.Headers[HttpHeaders.Sso].ToString()
            : cookieHandler.GetValue(CookieConstants.SsoTokenCrossDomain) ?? urlQuery[QueryKey].ToString();

        return !ssoToken.IsNullOrWhiteSpace() ? LoginAsync() : null;

        async Task LoginAsync() // Avoid async overhead if possible
        {
            try
            {
                var nativeAppDetails = nativeAppService.GetCurrentDetails();
                var parameters = new AutoLoginParameters(ssoToken)
                    { InvokersProductId = nativeAppDetails.IsNative ? nativeAppDetails.Product : null };

                if (urlQuery.ContainsKey(LoginTypeQueryKey))
                {
                    parameters.LoginType = urlQuery[LoginTypeQueryKey].ToString();
                }

                if (urlQuery.ContainsKey(TerminalIdQueryKey))
                {
                    parameters.TerminalId = urlQuery[TerminalIdQueryKey].ToString();
                }

                if (urlQuery.ContainsKey(ShopIdQueryKey))
                {
                    parameters.ShopId = urlQuery[ShopIdQueryKey].ToString();
                }

                await webAuthenticationService.LoginAsync(parameters, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex,
                    "Failed to login with SSO token '{SsoToken}' from: '{HeaderKey}' = '{HeaderValue}', '{CookieKey}' = '{CookieValue}',  '{QueryKey}' = '{QueryValue}',",
                    ssoToken,
                    HttpHeaders.Sso,
                    request.Headers[HttpHeaders.Sso].ToString(),
                    CookieConstants.SsoTokenCrossDomain,
                    cookieHandler.GetValue(CookieConstants.SsoTokenCrossDomain),
                    QueryKey,
                    request.Query[QueryKey].ToString());
            }

            // clear cookie on success login so it doesn't try to login again
            // clear cookie if login failed, probably because of invalid token
            DeleteCookie();
        }
    }

    private void DeleteCookie()
    {
        if (!string.IsNullOrEmpty(cookieHandler.GetValue(CookieConstants.SsoTokenCrossDomain)))
            cookieHandler.Delete(CookieConstants.SsoTokenCrossDomain);
    }
}
