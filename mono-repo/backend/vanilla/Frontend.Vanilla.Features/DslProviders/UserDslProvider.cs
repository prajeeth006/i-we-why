#nullable disable
using System;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IUserDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class UserDslProvider(
    ICurrentUserAccessor currentUserAccessor,
    ILastVisitorCookie lastVisitorCookie,
    IVisitorSettingsManager settingsManager,
    IPosApiAccountServiceInternal posApiAccountService,
    IPosApiCrmServiceInternal posApiCrmService,
    IPosApiAuthenticationServiceInternal posApiAuthenticationService,
    ICookieJsonHandler cookieJsonHandler,
    ITrackerIdResolver trackerIdResolver,
    IClock clock,
    IDateTimeCultureBasedFormatter dateTimeCultureBasedFormatter)
    : IUserDslProvider
{
    private const string PostLoginValuesWebmasterId = "WebmasterId";
    private const decimal FallbackNumber = -1m;

    public bool LoggedIn()
    {
        return currentUserAccessor.User.Identity?.IsAuthenticated == true;
    }

    private bool IsAuthenticatedOrHasWorkflow()
    {
        return currentUserAccessor.User.IsAuthenticatedOrHasWorkflow();
    }

    public bool IsAnonymous()
        => currentUserAccessor.User.IsAnonymous();

    public bool IsKnown()
    {
        return lastVisitorCookie.GetValue() != null;
    }

    public string GetCountry()
        => GetClaim(PosApiClaimTypes.Address.CountryId);

    public string GetLanguage()
        => GetClaim(PosApiClaimTypes.LanguageCode);

    public decimal GetAge()
    {
        var dateOfBirthClaim = GetClaim(PosApiClaimTypes.Birth.Date);

        if (!IsAuthenticatedOrHasWorkflow() || dateOfBirthClaim == null) return FallbackNumber;

        var dateOfBirth = DateTime.ParseExact(dateOfBirthClaim, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToUniversalTime();
        var now = clock.UtcNow;

        var years = now.Value.Year - dateOfBirth.Year;

        if (dateOfBirth.Date > now.Value.AddYears(-years))
        {
            years--;
        }

        return years;
    }

    public string GetCulture()
        => Thread.CurrentThread.CurrentCulture.Name;

    public string GetLoginName()
        => GetClaim(PosApiClaimTypes.Name);

    public decimal GetVisitCount()
        => settingsManager.Current.VisitCount;

    public async Task<string> GetLoyaltyStatusAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return null;

        var loyalty = await posApiCrmService.GetBasicLoyaltyProfileAsync(mode);

        return loyalty.Category;
    }

    public async Task<decimal> GetLoyaltyPointsAsync(ExecutionMode mode)
    {
        if (!LoggedIn()) return FallbackNumber;

        return await posApiCrmService.GetLoyaltyPointsAsync(mode);
    }

    public async Task<decimal> GetTierCodeAsync(ExecutionMode mode)
    {
        if (!IsAuthenticatedOrHasWorkflow()) return FallbackNumber;

        var valueSegment = await posApiCrmService.GetValueSegmentAsync(mode);

        return valueSegment.TierCode;
    }

    public async Task<bool> GetFirstLoginAsync(ExecutionMode mode)
    {
        if (!IsAuthenticatedOrHasWorkflow()) return false;

        var lastSession = await posApiAuthenticationService.GetLastSessionAsync(mode);

        return lastSession.IsFirstLogin;
    }

    [Obsolete("Instead check that trackerId is not empty.")]
    public bool HasTracker()
        => GetTrackerId() != null;

    public string GetTrackerId()
        => trackerIdResolver.Resolve(includeCookie: true);

    public string GetAffiliateInfo()
    {
        if (!IsAuthenticatedOrHasWorkflow()) return null;

        var affiliateInfo = cookieJsonHandler.GetValue(CookieConstants.PostLoginValues,
            PostLoginValuesWebmasterId.ToCamelCase());

        return affiliateInfo;
    }

    public async Task<string> GetGroupAttributeAsync(ExecutionMode mode, string groupName, string attributeName)
    {
        if (string.IsNullOrWhiteSpace(groupName) || string.IsNullOrWhiteSpace(attributeName) ||
            !IsAuthenticatedOrHasWorkflow())
            return null;

        var campaigns = await posApiCrmService.GetCampaignsAsync(mode);
        var campaign = campaigns.FirstOrDefault(c => c.Action == groupName);

        return campaign?.RewardAttributes.GetValue(attributeName);
    }

    public bool IsRealPlayer()
    {
        return currentUserAccessor.User.IsRealMoneyPlayer();
    }

    public async Task<bool> IsInGroupAsync(ExecutionMode mode, string group)
    {
        if (string.IsNullOrWhiteSpace(group) || !IsAuthenticatedOrHasWorkflow())
            return false;

        var groups = await posApiAccountService.GetSegmentationGroupsAsync(mode);

        return groups.Contains(group);
    }

    public decimal GetVisitAfterDays()
    {
        var settings = settingsManager.Current;

        if (settings.SessionStartTime == default
            || settings.PreviousSessionStartTime == default
            || settings.PreviousSessionStartTime > settings.SessionStartTime)
            return FallbackNumber;

        var timeSpan = settings.SessionStartTime - settings.PreviousSessionStartTime;

        return (int)timeSpan.TotalDays; // Int makes more sense for business
    }

    [Obsolete("Instead user Registration.Date provider.")]
    public Task<string> GetRegistrationDateAsync(ExecutionMode mode)
        => ConvertRegistrationTime(mode,
            convert: (regTime, _) => regTime.ToString(UserDslProviderConstants.RegistrationDateFormat),
            anonymousValue: string.Empty);

    // Note: we compares dates without time so register at 23:59, at 00:01 it's already 1 day
    [Obsolete("Instead user Registration.DaysRegistered provider.")]
    public Task<decimal> GetDaysRegisteredAsync(ExecutionMode mode)
        => ConvertRegistrationTime(mode,
            convert: (regTime, user) => (clock.UtcNow.ToUserLocalTime(user).Date - regTime.Date).Days,
            anonymousValue: FallbackNumber);

    public async Task<string> GetLastLoginTimeFormattedAsync(ExecutionMode mode)
    {
        if (!IsAuthenticatedOrHasWorkflow())
            return string.Empty;

        var lastSession = await posApiAuthenticationService.GetLastSessionAsync(mode);

        if (lastSession?.Details == null)
            return string.Empty;

        var formattedResult = dateTimeCultureBasedFormatter.Format(lastSession.Details.LoginTime
            .ToUserLocalTime(currentUserAccessor.User).DateTime);

        return formattedResult;
    }

    private async Task<T> ConvertRegistrationTime<T>(ExecutionMode mode, Func<DateTimeOffset, ClaimsPrincipal, T> convert, T anonymousValue)
    {
        var user = currentUserAccessor.User;

        if (!user.IsAuthenticatedOrHasWorkflow())
            return anonymousValue;

        var regTime = await posApiAccountService.GetRegistrationDateAsync(mode);

        return convert(regTime.ToUserLocalTime(user), user);
    }

    private string GetClaim(string claimType)
        => currentUserAccessor.User.FindValue(claimType);
}
