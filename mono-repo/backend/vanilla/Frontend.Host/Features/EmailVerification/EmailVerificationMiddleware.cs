using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Host.Features.EmailVerification;

internal sealed class EmailVerificationMiddleware(
    RequestDelegate next,
    ILogger<EmailVerificationMiddleware> log,
    IPosApiAccountServiceInternal accountService,
    IEmailVerificationConfiguration emailVerificationConfiguration,
    ILanguageService languageResolver)
    : Middleware(next)
{
    public const string EmailVerificationRoute = "/account/verify";
    public override async Task InvokeAsync(HttpContext httpContext)
    {
        var emailVerificationCode = httpContext.Request.Query["emailKey"].ToString();
        var resultCode = 200;
        var isJurisdictionMga = false;

        if (httpContext.User.Identity?.IsAuthenticated == true)
        {
            isJurisdictionMga = httpContext.User.FindValue(PosApiClaimTypes.JurisdictionId)?.Equals("MGA") ?? false;
        }

        try
        {
            await accountService.ValidateEmailVerificationCodeAsync(ExecutionMode.Async(httpContext.RequestAborted), emailVerificationCode);
            if (isJurisdictionMga)
            {
                resultCode = 201;
            }
        }
        catch (PosApiException sex)
        {
            switch (sex.PosApiCode)
            {
                case 1970:
                resultCode = isJurisdictionMga ? 1972 : sex.PosApiCode;
                log.LogWarning(sex, "Invalid email validation {code}.", emailVerificationCode);
                break;

                case 1971:
                resultCode = isJurisdictionMga ? 1973 : sex.PosApiCode;
                log.LogWarning(sex, "Email verification {code} already validated.", emailVerificationCode);
                break;

                default:
                resultCode = 1970;
                log.LogWarning(sex, "Failed to validate email verification {code}.", emailVerificationCode);
                break;
            }
        }
        catch (Exception ex)
        {
            resultCode = 1970;
            log.LogError(ex, "General error while trying to validate email verification {code}.", emailVerificationCode);
        }

        var url = emailVerificationConfiguration.RedirectUrl.Replace("{culture}", languageResolver.Current.RouteValue).Replace("{code}", resultCode.ToString());
        httpContext.Response.Redirect(url, false);
    }
}
