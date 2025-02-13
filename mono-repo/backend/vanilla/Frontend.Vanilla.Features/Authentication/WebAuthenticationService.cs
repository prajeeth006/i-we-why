using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Manager;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Authentication;

/// <summary>
/// Authentication service for logging in and out of Web applications,
/// as well as refreshing a user's authentication token before it expires.
/// </summary>
internal interface IWebAuthenticationService
{
    /// <summary>
    /// Authenticates a given username/password combination.
    /// </summary>
    Task<ILoginResult> LoginAsync(LoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with the given SSO Token. (AutoLogin).
    /// </summary>
    Task<ILoginResult> LoginAsync(AutoLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates the user with given tokens.
    /// </summary>
    Task<ILoginResult> LoginAsync(string userToken, string sessionToken, string productId, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with the given PID. (Login/PID).
    /// </summary>
    Task<ILoginResult> LoginAsync(PidLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with the given oAuthId. (OAuthLogin).
    /// </summary>
    Task<ILoginResult> LoginAsync(OAuthIdLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates with remember-me token.
    /// </summary>
    Task<ILoginResult> LoginAsync(RememberMeLoginParameters parameters, CancellationToken cancellationToken);

    /// <summary>
    /// Authenticates the user in using a workflow id.
    /// </summary>
    Task<ILoginResult> FinalizeWorkflowAsync(WorkflowParameters parameters, string productId, CancellationToken cancellationToken);

    /// <summary>
    /// Skips the current workflow and logs the user in.
    /// </summary>
    Task<ILoginResult> SkipWorkflowAsync(WorkflowParameters parameters, string productId, CancellationToken cancellationToken);

    /// <summary>
    /// Logs out the currently authenticated user.
    /// </summary>
    Task LogoutAsync(ExecutionMode mode);

    /// <summary>
    /// Cancels the given workflow and logs the user out.
    /// </summary>
    Task CancelWorkflowAndLogoutAsync(CancellationToken cancellationToken);

    Task RefreshTokenAsync(bool enforce, CancellationToken cancellationToken);

    Task SetAnonymousUserAsync(CancellationToken cancellationToken);
}

/// <summary>
/// Authentication service for login and logout operations.
/// </summary>
internal sealed class WebAuthenticationService(
    IHttpContextAccessor httpContextAccessor,
    IClaimsService claimsService,
    ISuperCookie superCookie,
    IEnvironmentProvider envProvider,
    IClientIPResolver clientIPResolver,
    IPostLoginValuesManager postLoginValuesManager,
    IClosedContentMessagesCookie closedContentMessagesCookie,
    IPosApiAuthenticationServiceInternal posApiAuthenticationService,
    IAuthenticationHelper authenticationHelper,
    IEndpointMetadata endpointMetadata,
    ICookieConfiguration cookieConfiguration,
    ICookieHandler cookieHandler,
    ILogger<WebAuthenticationService> log)
    : IWebAuthenticationService
{
    public async Task<ILoginResult> LoginAsync(LoginParameters parameters, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.LoginAsync(PreprocessParameters(parameters), cancellationToken));

    public async Task<ILoginResult> LoginAsync(AutoLoginParameters parameters, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.LoginAsync(parameters, cancellationToken));

    public async Task<ILoginResult> LoginAsync(PidLoginParameters parameters, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.LoginAsync(parameters, cancellationToken));

    public async Task<ILoginResult> LoginAsync(OAuthIdLoginParameters parameters, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.LoginAsync(parameters, cancellationToken));

    public async Task<ILoginResult> LoginAsync(RememberMeLoginParameters parameters, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.LoginAsync(parameters, cancellationToken));

    public async Task<ILoginResult> LoginAsync(string userToken, string sessionToken, string productId, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.LoginAsync(userToken, sessionToken, productId, cancellationToken));

    public async Task RefreshTokenAsync(bool enforce, CancellationToken cancellationToken)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var authProperties = httpContext.Features.Get<AuthenticationProperties>();
        var renewMetadata = endpointMetadata.Get<IRenewAuthenticationMetadata>();
        var shouldRenew = renewMetadata?.ShouldRenew ?? enforce || (authProperties != null && authenticationHelper.IsSecondHalfOfExpiration(authProperties));

        if (!shouldRenew) return;

        await SetAuthCookieForCurrentUserAsync(httpContext);
        log.LogInformation("Refreshing token for {user}", httpContext.User.Identity?.Name);
        await posApiAuthenticationService.RefreshTokenAsync(cancellationToken);
    }

    public async Task SetAnonymousUserAsync(CancellationToken cancellationToken)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        httpContext.User = await posApiAuthenticationService.SetupAnonymousUserAsync(cancellationToken);
    }

    public async Task<ILoginResult> FinalizeWorkflowAsync(WorkflowParameters parameters, string productId, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.FinalizeWorkflowAsync(parameters, productId, cancellationToken));

    public async Task<ILoginResult> SkipWorkflowAsync(WorkflowParameters parameters, string productId, CancellationToken cancellationToken)
        => await LoginCoreAsync(await claimsService.SkipWorkflowAsync(parameters, productId, cancellationToken));

    public async Task LogoutAsync(ExecutionMode mode)
    {
        await LogoutOnWebLayerAsync();
        await posApiAuthenticationService.LogoutAsync(mode);
    }

    public async Task CancelWorkflowAndLogoutAsync(CancellationToken cancellationToken)
    {
        await LogoutOnWebLayerAsync();
        await posApiAuthenticationService.CancelWorkflowAndLogoutAsync(cancellationToken);
    }

    private async Task LogoutOnWebLayerAsync()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        await httpContext.SignOutAsync();
        // TODO: Delete when nobody is on Vanilla 18 anymore.
        cookieHandler.Delete(CookieConstants.AuthLegacy);
        httpContext.Response.Cookies.Delete(LoginCookies.SsoToken, new CookieOptions { Domain = cookieConfiguration.CurrentLabelDomain });
    }

    private async Task<ILoginResult> LoginCoreAsync(ILoginResult loginResult)
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();

        superCookie.SetValue(loginResult.SuperCookie ?? string.Empty);
        closedContentMessagesCookie.RemoveValuesOnLogin();

        await SetAuthCookieForCurrentUserAsync(httpContext);

        postLoginValuesManager.StorePostLoginValues(loginResult);

        return loginResult;
    }

    private async Task SetAuthCookieForCurrentUserAsync(HttpContext httpContext)
    {
        var identityKey = GetUserIdentityKey(httpContext);
        var owinIdentity = new ClaimsIdentity(
            new List<Claim>
            {
                new Claim(ClaimTypes.Name, identityKey),
                new Claim("domain", "." + envProvider.CurrentLabel),
            },
            CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(owinIdentity);

        await httpContext.SignInAsync(claimsPrincipal);
    }

    private const string AnonymousUserName = "¿anon?";

    private string GetUserIdentityKey(HttpContext httpContext)
    {
        var authTokens = httpContext.User.GetPosApiAuthTokens();

        if (authTokens != null)
            return authTokens.UserToken + ":" + authTokens.SessionToken;

        var clientIp = clientIPResolver.Resolve();

        return $"{AnonymousUserName}:{clientIp}";
    }

    private LoginParameters PreprocessParameters(LoginParameters parameters)
    {
        if (parameters.Fingerprint != null && string.IsNullOrEmpty(parameters.Fingerprint.SuperCookie))
        {
            parameters.Fingerprint.SuperCookie = superCookie.GetValue();
        }

        return parameters;
    }
}
