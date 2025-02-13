using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Messages;
using Frontend.Vanilla.Features.PlaceholderReplacers;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login;

/// <summary>
/// Used to login user.
/// </summary>
public interface ILoginResultHandler
{
    /// <summary>
    /// Used to login user.
    /// </summary>
    Task<IActionResult> LoginAsync(
        MobileLoginParameters parameters,
        CancellationToken cancellationToken);
}

internal interface ILoginResultHandlerInternal
{
    Task<IActionResult> HandleAsync(Func<ILoginService, Task<LoginInfo>> loginFunc, CancellationToken cancellationToken);
}

internal sealed class LoginResultHandler(
    ILoginService loginService,
    IWebAuthenticationService authenticationService,
    ICookieHandler cookieHandler,
    IProductPlaceholderReplacer productPlaceholderReplacer,
    IClaimsService claimsService,
    ICurrentUserAccessor currentUserAccessor,
    IBalanceServiceClient balanceServiceClient,
    IPosApiCrmServiceInternal posApiCrmService,
    ILogger<LoginResultHandler> log)
    : ILoginResultHandler, ILoginResultHandlerInternal
{
    public async Task<IActionResult> HandleAsync(Func<ILoginService, Task<LoginInfo>> loginFunc, CancellationToken cancellationToken)
    {
        try
        {
            var loginInfo = await loginFunc(loginService);
            var rememberMeEnabled = !string.IsNullOrWhiteSpace(loginInfo.RememberMeToken?.ToString());

            switch (loginInfo.Status)
            {
                case LoginStatus.Error:
                    IActionResult result = new BadRequestObjectResult(new { errorCode = loginInfo.ErrorCode, posApiErrorMessage = loginInfo.PosApiErrorMessage });

                    if (loginInfo.RedirectUrl != null)
                    {
                        result = result.WithKeyValue("redirectUrl", loginInfo.RedirectUrl);
                    }

                    if (loginInfo.ErrorMessage != null)
                    {
                        result = result.WithMessage(loginInfo.MessageType ?? MessageType.Error, loginInfo.ErrorMessage);
                    }

                    if (loginInfo.ErrorValues != null)
                    {
                        result = result.WithValues(loginInfo.ErrorValues);
                    }

                    if (loginInfo.PosApiErrorMessage != null)
                    {
                        result = result.WithKeyValue("posApiErrorMessage", loginInfo.PosApiErrorMessage);
                    }

                    return result;
                case LoginStatus.Redirect:
                    var options = loginInfo.PostLoginRedirect.Value.Options ?? new PostLoginRedirectOptions();

                    if (options.Logout)
                    {
                        await authenticationService.LogoutAsync(ExecutionMode.Async(cancellationToken));
                    }

                    if (options.PostLoginWorkflowMode)
                    {
                        loginService.StorePostLoginRedirectKeyInCache(loginInfo.PostLoginRedirect.Key);
                    }

                    var redirectUrl = await productPlaceholderReplacer.ReplaceAsync(ExecutionMode.Async(cancellationToken), loginInfo.PostLoginRedirect.Value.Url);

                    return new OkObjectResult(
                        await CreateLoginResponseAsync(
                            !options.WorkflowMode,
                            cancellationToken,
                            redirectUrl,
                            !options.Logout,
                            loginInfo.PostLoginRedirect.Value.Action,
                            rememberMeEnabled));
                default:
                    // Success
                    // clean possible post login redirect key cache
                    loginService.RemovePostLoginRedirectKeyFromCache();
                    var loginResponse = await CreateLoginResponseAsync(true, cancellationToken, rememberMeEnabled: rememberMeEnabled);
                    WriteToSsoCookie();

                    return new OkObjectResult(loginResponse);
            }
        }
        catch (PosApiException sex)
        {
            log.LogError(sex, "PosApiException in login workflow");

            return new BadRequestObjectResult(new { errorCode = sex.PosApiCode, posApiErrorMessage = sex.PosApiMessage }).WithTechnicalErrorMessage();
        }
        catch (Exception ex)
        {
            log.LogError(ex, "General exception in login workflow");

            return new BadRequestResult().WithTechnicalErrorMessage();
        }
    }

    private void WriteToSsoCookie()
    {
        cookieHandler.Set(LoginCookies.SsoToken, currentUserAccessor.User.FindValue(PosApiClaimTypes.SsoToken)!, new CookieSetOptions()
        {
            HttpOnly = true,
        });
    }

    private async Task<LoginResponse> CreateLoginResponseAsync(
        bool isCompleted,
        CancellationToken cancellationToken,
        string? redirectUrl = null,
        bool shouldFetchPostLoginValues = true,
        string? action = null,
        bool rememberMeEnabled = false)
    {
        var user = currentUserAccessor.User;
        var claims = user.Claims.Where(c => !string.IsNullOrEmpty(c.Value)).ToDictionary(c => c.Type, c => c.Value);
        Balance? balance = null;
        BasicLoyaltyProfile? loyaltyProfile = null;
        if (user.IsAuthenticatedOrHasWorkflow())
        {
            try
            {
                // run in parallel
                var balanceTask = balanceServiceClient.TryAsync(c => c.GetAsync(ExecutionMode.Async(cancellationToken), true), log);
                var loyaltyProfileTask = posApiCrmService.TryAsync(s => s.GetBasicLoyaltyProfileAsync(cancellationToken), log);
                balance = await balanceTask;
                loyaltyProfile = await loyaltyProfileTask;
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error in login flow while fetching balance/loyaltyProfile.");
            }
        }
        var userInfo = new UserInfo(user.Identity?.IsAuthenticated is true, loyaltyProfile?.Category);

        return new LoginResponse
        {
            IsCompleted = isCompleted,
            RedirectUrl = redirectUrl,
            User = userInfo,
            Claims = claims,
            Action = action,
            PostLoginValues = shouldFetchPostLoginValues ? await claimsService.GetPostLoginValuesAsync(cancellationToken) : null,
            RememberMeEnabled = rememberMeEnabled,
            Balance = balance,
        };
    }

    public Task<IActionResult> LoginAsync(MobileLoginParameters parameters, CancellationToken cancellationToken)
        => HandleAsync(s => s.Login(parameters, cancellationToken), cancellationToken);
}
