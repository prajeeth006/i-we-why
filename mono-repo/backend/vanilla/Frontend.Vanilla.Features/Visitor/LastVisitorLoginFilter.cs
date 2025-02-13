using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Visitor;

internal sealed class LastVisitorLoginFilter(
    ILastVisitorCookie cookie,
    IAuthenticationConfiguration config,
    IHttpContextAccessor httpContextAccessor,
    ILogger<LastVisitorLoginFilter> log)
    : LoginFilter
{
    public override void AfterLogin(AfterLoginContext context)
    {
        // The last visitor name is the value of the first claim that matches the input user name (case insensitive)
        var user = httpContextAccessor.GetRequiredHttpContext().User;
        var inputUsername = ((context.Request.Content as LoginParameters)?.Username ?? user.Identity?.Name)?.Trim();

        if (inputUsername.IsNullOrWhiteSpace())
        {
            log.LogWarning("User has no username after login by {loginParameters}. Is this fine?", context.Request.Content?.GetType().ToString());

            return;
        }

        var matchingClaimValue = config.EligibleLoginNameClaimTypes
            .Select(t => user.FindValue(t)?.Trim())
            .FirstOrDefault(v => inputUsername.EqualsIgnoreCase(v));

        if (matchingClaimValue == null)
        {
            // Note: This could also be treated as a warning
            log.LogError("After login checked {eligibleClaims} of the user but none matches {inputUsername}. Most likely reasons are:"
                         + " 1. Configuration for {dynaConFeature} is wrong => check DynaCon."
                         + " 2. PosAPI or Platform mixed up claims => check PosAPI Trace & contact corresponding teams."
                         + " 3. Merging of claims on Vanilla is broken => contact Vanilla Team",
                config.EligibleLoginNameClaimTypes.Join(),
                inputUsername,
                AuthenticationConfiguration.FeatureName);
        }

        cookie.SetValue(matchingClaimValue ?? inputUsername);
    }
}
