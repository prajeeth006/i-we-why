#nullable disable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.Login.ErrorFormatters;
using Frontend.Vanilla.Features.Messages;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using static System.Int32;

namespace Frontend.Vanilla.Features.Login;

internal interface ILoginService
{
    Task<LoginInfo> Login(MobileLoginParameters mobileLoginParameters, CancellationToken cancellationToken);
    Task<LoginInfo> Login(RememberMeLoginParameters parameters, CancellationToken cancellationToken);
    Task<LoginInfo> FinalizeWorkflow(WorkflowParameters parameters, CancellationToken cancellationToken);
    Task<LoginInfo> SkipWorkflow(WorkflowParameters parameters, CancellationToken cancellationToken);

    Task<LoginInfo> LoginUsingTokens(string userToken, string sessionToken, CancellationToken cancellationToken);
    Task<LoginInfo> FinalizePostLoginWorkflow(CancellationToken cancellationToken);
    Task<KeyValuePair<string, PostLoginRedirect>> GetNextPostLoginRedirectAsync(ExecutionMode mode);
    PostLoginRedirect GetPostLoginRedirect(string key);
    string GetPostLoginRedirectKeyFromCache();
    void StorePostLoginRedirectKeyInCache(string workflowKey);
    void RemovePostLoginRedirectKeyFromCache();
    bool IsInWorkflowUrlWhiteList(string requestUrl);
}

internal sealed class LoginService(
    ILoginConfiguration loginConfiguration,
    IWebAuthenticationService authenticationService,
    ILanguageService languageService,
    IContentService contentService,
    ILoginSettingsConfiguration loginSettingsConfiguration,
    IReCaptchaService reCaptchaService,
    ILogger<LoginService> log,
    ICurrentUserAccessor currentUserAccessor,
    ILabelIsolatedDistributedCache distributedCache,
    IRememberMeTokenStorage rememberMeTokenStorage,
    IServiceProvider serviceProvider,
    ILastKnownProductDslProvider lastKnownProductDslProvider,
    INativeAppService nativeAppService,
    ICookieHandler cookieHandler)
    : ILoginService
{
    private const string CacheKeyPrefix = "LH:LastSeenPostLoginWorkflow-";

    public Task<LoginInfo> Login(MobileLoginParameters mobileLoginParameters, CancellationToken cancellationToken)
    {
        mobileLoginParameters.VanillaIdToken = loginConfiguration.VanillaIdToken;
        if (!string.IsNullOrEmpty(mobileLoginParameters.SsoToken))
        {
            var ssoAutoLoginParameters = new AutoLoginParameters(mobileLoginParameters.SsoToken);

            return LoginInternalAsync(s => s.LoginAsync(ssoAutoLoginParameters, cancellationToken), cancellationToken);
        }

        if (mobileLoginParameters.LoginType == LoginType.RememberMe)
        {
            var rememberMeLoginParameters = new RememberMeLoginParameters(mobileLoginParameters.RememberMeToken)
            {
                Fingerprint = mobileLoginParameters.Fingerprint,
                TokenType = mobileLoginParameters.LoginType,
            };

            return LoginInternalAsync(s => s.LoginAsync(rememberMeLoginParameters, cancellationToken), cancellationToken);
        }

        if (!string.IsNullOrEmpty(mobileLoginParameters.Pid))
        {
            var pidLoginParameters = new PidLoginParameters(mobileLoginParameters.Pid)
            {
                ProductId = mobileLoginParameters.ProductId,
                Fingerprint = mobileLoginParameters.Fingerprint,
                Username = mobileLoginParameters.Username,
                Password = mobileLoginParameters.Password,
            };

            return LoginInternalAsync(s => s.LoginAsync(pidLoginParameters, cancellationToken), cancellationToken);
        }

        if (!string.IsNullOrEmpty(mobileLoginParameters.AuthorizationCode) &&
            string.IsNullOrEmpty(mobileLoginParameters.Username) &&
            string.IsNullOrEmpty(mobileLoginParameters.Password))
        {
            var parameters = new OAuthIdLoginParameters(mobileLoginParameters.AuthorizationCode, mobileLoginParameters.OAuthProvider, mobileLoginParameters.OAuthUserId)
            {
                ProductId = mobileLoginParameters.ProductId,
                Fingerprint = mobileLoginParameters.Fingerprint,
                RequestData = { mobileLoginParameters.RequestData.NullToEmpty() },
                NewReq = mobileLoginParameters.NewReq,
                NewUser = mobileLoginParameters.NewUser,
            };

            return LoginInternalAsync(s => s.LoginAsync(parameters, cancellationToken), cancellationToken);
        }

        var username = loginSettingsConfiguration.SignInByEmail && !LoginType.ConnectCard.Equals(mobileLoginParameters.LoginType, StringComparison.OrdinalIgnoreCase)
            ? mobileLoginParameters.Email
            : mobileLoginParameters.Username;

        var loginParameters = new LoginParameters(username, mobileLoginParameters.Password)
        {
            ProductId = mobileLoginParameters.ProductId,
            BrandId = mobileLoginParameters.BrandId,
            DateOfBirth = loginSettingsConfiguration.IsDateOfBirthEnabled ? mobileLoginParameters.DateOfBirth : null,
            Fingerprint = mobileLoginParameters.Fingerprint,
            LoginType = mobileLoginParameters.LoginType,
            RememberMe = mobileLoginParameters.RememberMe,
            HandshakeSessionKey = mobileLoginParameters.HandShakeSessionKey,
            RequestData = { mobileLoginParameters.RequestData.NullToEmpty() },
            ShopId = mobileLoginParameters.ShopId,
            TerminalId = mobileLoginParameters.TerminalId,
            VanillaIdToken = mobileLoginParameters.VanillaIdToken,
        };

        return LoginInternalAsync(
            s => s.LoginAsync(loginParameters, cancellationToken),
            cancellationToken,
            userCheckedRememberMe: loginParameters.RememberMe);
    }

    public Task<LoginInfo> Login(RememberMeLoginParameters parameters, CancellationToken cancellationToken)
        => LoginInternalAsync(s => s.LoginAsync(parameters, cancellationToken), cancellationToken);

    public async Task<LoginInfo> LoginUsingTokens(string userToken, string sessionToken, CancellationToken cancellationToken)
    {
        return await LoginInternalAsync(s => s.LoginAsync(userToken, sessionToken, GetProductId(), cancellationToken), cancellationToken, false);
    }

    public async Task<LoginInfo> FinalizeWorkflow(WorkflowParameters parameters, CancellationToken cancellationToken)
    {
        return await LoginInternalAsync(s => s.FinalizeWorkflowAsync(parameters, GetProductId(), cancellationToken), cancellationToken, false);
    }

    public async Task<LoginInfo> SkipWorkflow(WorkflowParameters parameters, CancellationToken cancellationToken)
    {
        return await LoginInternalAsync(s => s.SkipWorkflowAsync(parameters, GetProductId(), cancellationToken), cancellationToken, false);
    }

    public async Task<LoginInfo> FinalizePostLoginWorkflow(CancellationToken cancellationToken)
    {
        // init loginInfo and retrieve login result infos from cache as we
        // don't get them from pos on post login workflows anymore
        var loginInfo = new LoginInfo
        {
            Status = LoginStatus.Success,
        };

        var postLoginRedirect = await GetNextPostLoginRedirectAsync(ExecutionMode.Async(cancellationToken));

        if (postLoginRedirect.Key == null) return loginInfo;

        loginInfo.Status = LoginStatus.Redirect;
        loginInfo.PostLoginRedirect = postLoginRedirect;

        return loginInfo;
    }

    public async Task<KeyValuePair<string, PostLoginRedirect>> GetNextPostLoginRedirectAsync(ExecutionMode mode)
    {
        foreach (var redirect in loginSettingsConfiguration.PostLoginRedirects.OrderBy(o => o.Value.Order))
            if (await redirect.Value.Enabled.EvaluateAsync(mode))
            {
                SaveDisplayedInterceptorCookie(redirect.Key);

                return redirect;
            }

        var workflowTypeId = currentUserAccessor.User.GetWorkflowTypeId();

        if (workflowTypeId != 0)
            throw new Exception(
                $"User has workflow '{workflowTypeId}' but no corresponding 'PostLoginRedirects' is configured in '{LoginSettingsConfiguration.FeatureName}'.");

        return default;
    }

    public PostLoginRedirect GetPostLoginRedirect(string key)
    {
        return loginSettingsConfiguration.PostLoginRedirects[key];
    }

    public string GetPostLoginRedirectKeyFromCache()
    {
        var serializedPostLoginRedirectKey = distributedCache.GetString(GetDistributedCacheKey());

        return serializedPostLoginRedirectKey == null ? null : JsonConvert.DeserializeObject<string>(serializedPostLoginRedirectKey);
    }

    public void StorePostLoginRedirectKeyInCache(string workflowKey)
    {
        var cacheKey = GetDistributedCacheKey();

        if (cacheKey == CacheKeyPrefix)
            throw new ArgumentException("Cannot store PostLoginRedirectKey with cache key lacking session token.");

        RemovePostLoginRedirectKeyFromCache();
        var serializedPostLoginRedirectKey = JsonConvert.SerializeObject(workflowKey);
        distributedCache.SetString(cacheKey, serializedPostLoginRedirectKey);
    }

    public void RemovePostLoginRedirectKeyFromCache()
    {
        distributedCache.Remove(GetDistributedCacheKey());
    }

    public bool IsInWorkflowUrlWhiteList(string requestUrl)
    {
        var whiteList = loginSettingsConfiguration.WorkflowIdUrlWhitelist.OrderBy(o => o.Value.Order).FirstOrDefault(o => o.Value.Enabled.Evaluate());

        return whiteList.Value.Urls.Any(requestUrl.Contains);
    }

    private void SaveDisplayedInterceptorCookie(string redirectKey)
    {
        var displayedInterceptorsCookie = cookieHandler.GetValue(LoginCookies.DisplayedInterceptors);

        if (displayedInterceptorsCookie == null || !displayedInterceptorsCookie.Split(',').Contains(redirectKey))
        {
            displayedInterceptorsCookie += (displayedInterceptorsCookie == null ? string.Empty : ",") + redirectKey;
            cookieHandler.Set(LoginCookies.DisplayedInterceptors, displayedInterceptorsCookie);
        }
    }

    private string GetDistributedCacheKey()
        => $"{CacheKeyPrefix}{currentUserAccessor.User.FindValue(PosApiClaimTypes.SessionToken)}";

    private async Task<LoginInfo> LoginInternalAsync(
        Func<IWebAuthenticationService, Task<ILoginResult>> loginAction,
        CancellationToken cancellationToken,
        bool setUserLanguage = true,
        bool userCheckedRememberMe = false)
    {
        // init loginInfo to store all login related infos
        var loginInfo = new LoginInfo { Status = LoginStatus.None };

        // store current thread culture to set it again after vanilla has overridden it to the user's account culture
        var lastUsedSessionCulture = Thread.CurrentThread.CurrentCulture;

        try
        {
            // attempt to login via PosAPI (vanilla login service)
            var posApiResult = await loginAction(authenticationService);

            // *** LOGIN SUCCESSFUL at this point
            loginInfo.RememberMeToken = !string.IsNullOrWhiteSpace(posApiResult.RememberMeToken)
                ? new TrimmedRequiredString(posApiResult.RememberMeToken.Trim())
                : null;

            if (userCheckedRememberMe)
            {
                if (loginInfo.RememberMeToken != null)
                    // RememberMeApiController.Put() gets it and writes to cookie, it isn't transferred to client for security reasons
                    await rememberMeTokenStorage.SetAsync(loginInfo.RememberMeToken, cancellationToken);
                else
                    log.LogRememberMePlatformError(null,
                        "didn't return a token on login despite it was requested in login payload based on user's input. User will receive regular short session.");
            }

            // report successful login to recaptcha service (resets FailureCount)
            await reCaptchaService.ReportSuccessAsync("Login", cancellationToken);

            if (setUserLanguage)
            {
                // set original and new language values (also needed for route building)
                SetLanguage(loginInfo);
            }
            else
            {
                // re-store to the last used session culture
                RestoreLanguage(loginInfo, lastUsedSessionCulture);
            }

            var postLoginRedirect = await GetNextPostLoginRedirectAsync(ExecutionMode.Async(cancellationToken));

            if (postLoginRedirect.Key != null)
            {
                loginInfo.Status = LoginStatus.Redirect;
                loginInfo.PostLoginRedirect = postLoginRedirect;

                return loginInfo;
            }
        }
        catch (PosApiException sex)
        {
            // *** LOGIN FAILED
            loginInfo.Status = LoginStatus.Error;
            loginInfo.ErrorCode = sex.PosApiCode.ToString();
            loginInfo.PosApiErrorMessage = sex.PosApiMessage;
            loginInfo.ErrorValues = sex.PosApiValues;

            // report failed login to recaptcha service (increases FailureCount)
            if (sex.PosApiCode is 600 or 1706) // message": "Authentication failed"
            {
                await reCaptchaService.ReportFailureAsync("Login", cancellationToken);
            }

            var (redirectUrl, errorMessage, messageType) = await GetErrorDetailsAsync(sex, cancellationToken);
            loginInfo.RedirectUrl = redirectUrl;
            loginInfo.ErrorMessage = errorMessage;
            loginInfo.MessageType = messageType;

            return loginInfo;
        }

        // LOGIN OK
        loginInfo.Status = LoginStatus.Success;

        return loginInfo;
    }

    private void SetLanguage(LoginInfo loginInfo)
    {
        var currentLanguage = languageService.Current;
        // if culture from claims is supported, set this as new one for the user/session, if not then leave at current session culture
        var newLanguage = languageService.FindByUserClaims() ?? currentLanguage;
        loginInfo.NewLanguage = newLanguage.RouteValue;
        loginInfo.OriginalLanguage = currentLanguage.RouteValue;
        // update thread language so content is got in correct language (e.g. for status messages)
        CultureInfoHelper.SetCurrent(newLanguage.Culture);
    }

    private void RestoreLanguage(LoginInfo loginInfo, CultureInfo lastUsedSessionCulture)
    {
        // re-store the current session culture
        Thread.CurrentThread.CurrentCulture = Thread.CurrentThread.CurrentUICulture = lastUsedSessionCulture;

        // set original and new language to current session language
        // (for the case the user switch language on a interceptor page or is native application where application language overrides user language)
        loginInfo.NewLanguage = loginInfo.OriginalLanguage = languageService.Current.RouteValue;
    }

    private async Task<(string, string, MessageType?)> GetErrorDetailsAsync(PosApiException sex, CancellationToken cancellationToken)
    {
        var errorCodeHandler = GetErrorHandler(sex) ?? new ErrorHandler { Name = "Failure" };

        if (ShouldRedirect(errorCodeHandler))
        {
            return (errorCodeHandler.RedirectUrl, null, null);
        }

        var messageType = Enum.TryParse(errorCodeHandler.MessageType, true, out MessageType result) ? result : MessageType.Error;
        var errorCodeName = errorCodeHandler.Name;
        var errorMessage = (await contentService.GetRequiredAsync<IViewTemplate>("MobileLogin-v1.0/Login/Errors/" + errorCodeName, cancellationToken)).Text;

        try
        {
            if (errorCodeHandler.Parameters != null)
            {
                var parameters = errorCodeHandler.Parameters.Select(p => FormatErrorParameter(sex.PosApiValues, p)).ToArray();

                return (null, string.Format(errorMessage, parameters), messageType);
            }
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Parameter formatting failed for {errorMessage} with {parameters}", errorMessage, errorCodeHandler.Parameters);
        }

        return (null, errorMessage, messageType);
    }

    private bool ShouldRedirect(ErrorHandler errorCodeHandler)
    {
        TryParse(cookieHandler.GetValue(CookieConstants.LoginAttempts), out var attempts);

        attempts++;

        if (errorCodeHandler.RedirectUrl != null &&
            (!errorCodeHandler.AttemptsBeforeRedirect.HasValue || attempts == errorCodeHandler.AttemptsBeforeRedirect))
        {
            cookieHandler.Delete(CookieConstants.LoginAttempts);

            return true;
        }

        cookieHandler.Set(CookieConstants.LoginAttempts, attempts.ToString());

        return false;
    }

    private ErrorHandler GetErrorHandler(PosApiException sex)
    {
        var errorCodeHandlers = loginSettingsConfiguration.ErrorCodeHandlers
            .Where(e => e.Value.Enabled.Code == sex.PosApiCode)
            .Select(e => e.Value)
            .ToList();

        switch (errorCodeHandlers.Count)
        {
            case 0:
                return null;
            case 1:
                return errorCodeHandlers.First();
        }

        // try to find matching error handler by parameter name and value
        var parametersErrorHandlers = errorCodeHandlers
            .Where(e => e.Enabled.ParameterName != null && sex.PosApiValues.ContainsKey(e.Enabled.ParameterName));

        foreach (var parameterErrorHandler in parametersErrorHandlers)
        {
            var errorHandlerEnabled = parameterErrorHandler.Enabled;

            try
            {
                TryParse(sex.PosApiValues[errorHandlerEnabled.ParameterName], out var actualValue);

                switch (errorHandlerEnabled.Operator)
                {
                    case "<":
                        if (actualValue < errorHandlerEnabled.ParameterValue) return parameterErrorHandler;

                        break;
                    case ">":
                        if (actualValue > errorHandlerEnabled.ParameterValue) return parameterErrorHandler;

                        break;
                    case "=":
                        if (actualValue == errorHandlerEnabled.ParameterValue) return parameterErrorHandler;

                        break;
                }
            }
            catch (Exception e)
            {
                log.LogError(e,
                    "Failed parsing login error enabled with {code}, {parameterName}, {parameterValue}, {operator} and {posapiValues}",
                    errorHandlerEnabled.Code,
                    errorHandlerEnabled.ParameterName,
                    errorHandlerEnabled.ParameterValue,
                    errorHandlerEnabled.Operator,
                    sex.PosApiValues);
            }
        }

        // return default match by error code disregarding parameterName
        return errorCodeHandlers.FirstOrDefault(e => e.Enabled.ParameterName == null);
    }

    private string FormatErrorParameter(IReadOnlyDictionary<string, string> errorValues, ErrorHandlerParameter parameter)
    {
        var stringValue = errorValues[parameter.Name];
        object value;

        if (parameter.Type != null)
        {
            var defaultConverterType = typeof(IDefaultLoginErrorConverter);
            var converterType = Type.GetType($"{defaultConverterType.Namespace}.I{parameter.Type}LoginErrorConverter") ?? defaultConverterType;
            var converterInstance = serviceProvider.GetService(converterType);
            value = ((ILoginErrorConverter)converterInstance)?.Convert(stringValue, parameter);
        }
        else
        {
            value = stringValue;
        }

        string formattedValue;

        if (parameter.Format != null)
        {
            try
            {
                formattedValue = string.Format("{0:" + parameter.Format + "}", value);
            }
            catch (Exception ex)
            {
                log.LogError(ex, "Error formatting {name} with {format}", parameter.Name, parameter.Format);

                return stringValue;
            }
        }
        else
        {
            formattedValue = value?.ToString();
        }

        return formattedValue;
    }

    private string GetProductId()
    {
        var nativeAppDetails = nativeAppService.GetCurrentDetails();
        var productId = nativeAppDetails.IsNative ? nativeAppDetails.Product : lastKnownProductDslProvider.PlatformProductId;

        return productId;
    }
}
