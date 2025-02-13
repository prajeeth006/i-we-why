using System.Collections.Generic;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.AntiForgery;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.User;

internal sealed class UserClientConfigProvider(
    IPosApiAccountServiceInternal posApiAccountService,
    ICurrentUserAccessor currentUserAccessor,
    ILanguageService languageService,
    ILastVisitorCookie lastVisitorCookie,
    IPosApiCrmServiceInternal posApiCrmService,
    IPosApiAuthenticationService posApiAuthenticationService,
    IAntiForgeryToken antiForgeryToken,
    ILoginService loginService,
    IClock clock,
    IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter,
    IVisitorSettingsManager settingsManager,
    IUserDslProvider userDslProvider,
    ILogger<UserClientConfigProvider> log)
    : LambdaClientConfigProvider("vnUser", async cancellationToken =>
    {
        var values = new Dictionary<string, object?>();
        var user = currentUserAccessor.User;
        var workflowTypeId = user.Try(u => PosApiUserExtensions.GetWorkflowTypeId(u), log);
        var userTimeZone = user.Try(u => u.GetTimeZone(), log);
        var userTimeZoneUtcOffset = userTimeZone?.GetUtcOffset(clock.UtcNow.Value).TotalMinutes ?? 0;

        values.Add("lang", (languageService.FindByUserClaims() ?? languageService.Default).RouteValue);
        values.Add("returning", lastVisitorCookie.GetValue() != null);
        values.Add("isAuthenticated", user.Identity?.IsAuthenticated is true);
        values.Add("isAnonymous", user.IsAnonymous());
        values.Add("workflowType", GetWorkflowType(loginService, workflowTypeId));
        values.Add("userTimezoneUtcOffset", userTimeZoneUtcOffset);
        values.Add("xsrfToken", antiForgeryToken.GetValue());
        values.Add("visitCount", settingsManager.Current.VisitCount);
        values.Add("visitAfterDays", userDslProvider.GetVisitAfterDays());

        if (user.IsAuthenticatedOrHasWorkflow())
        {
            var valueSegmentTask = posApiCrmService.TryAsync(s => s.GetValueSegmentAsync(cancellationToken), log);
            var lastSessionTask = posApiAuthenticationService.TryAsync(s => s.GetLastSessionAsync(cancellationToken), log);
            var registrationDateTask = posApiAccountService.TryAsync(p => p.GetRegistrationDateAsync(cancellationToken), log);

            if (user.Identity?.IsAuthenticated is true)
            {
                var loyaltyProfileTask = posApiCrmService.TryAsync(s => s.GetBasicLoyaltyProfileAsync(cancellationToken), log);
                var loyaltyPointsTask = posApiCrmService.TryAsync(s => s.GetLoyaltyPointsAsync(cancellationToken), log);

                values.Add("loyalty", (await loyaltyProfileTask)?.Category);
                values.Add("loyaltyPoints", (int)await loyaltyPointsTask);
            }

            var valueSegment = await valueSegmentTask;
            var lastSession = await lastSessionTask;
            var registrationDate = await registrationDateTask;

            values.Add("isFirstLogin", lastSession?.IsFirstLogin ?? false);
            values.Add("registrationDate", dateTimeCultureBasedFormatter.Format(registrationDate.Value));
            values.Add("daysRegistered", (clock.UtcNow.ToUserLocalTime(user).Date - registrationDate.Value.Date).Days);

            if (valueSegment != null)
            {
                values.Add("customerId", valueSegment.CustomerId);
                values.Add("segmentId", valueSegment.SegmentId);
                values.Add("lifeCycleStage", valueSegment.LifeCycleStage);
                values.Add("eWarningVip", valueSegment.Ewvip);
                values.Add("microSegmentId", valueSegment.MicroSegmentId);
                values.Add("churnRate", valueSegment.ChurnRate);
                values.Add("futureValue", valueSegment.FutureValue);
                values.Add("potentialVip", valueSegment.PotentialVip);
                values.Add("tierCode", valueSegment.TierCode);
                values.Add("playerPriority", valueSegment.PlayerPriority);
            }

            if (lastSession?.Details != null)
            {
                var lastLoginLocalTime = userTimeZone != null ? lastSession.Details.LoginTime.ConvertTo(userTimeZone) : lastSession.Details.LoginTime.Value;
                values.Add("lastLoginTimeFormatted", dateTimeCultureBasedFormatter.Format(lastLoginLocalTime.DateTime));
                values.Add("lastLoginTime", lastSession.Details.LoginTime);
            }
        }

        return values;
    })
{
    // Run tasks in parallel
    private static int GetWorkflowType(ILoginService loginService, int workflowTypeId)
    {
        var postLoginRedirectKey = loginService.GetPostLoginRedirectKeyFromCache();
        var postLoginWorkflowId = postLoginRedirectKey == null ? 0 : loginService.GetPostLoginRedirect(postLoginRedirectKey).Options.OverrideWorkflowType;

        return workflowTypeId != 0 ? workflowTypeId : postLoginWorkflowId;
    }
}
