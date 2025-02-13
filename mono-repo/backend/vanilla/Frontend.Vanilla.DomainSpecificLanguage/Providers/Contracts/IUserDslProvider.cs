using System;
using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Values related to the logged-on or anonymous user.
/// </summary>
[Description("Values related to the logged-on or anonymous user.")]
public interface IUserDslProvider
{
    /// <summary>
    /// Determines whether it is a first login for the user based on last session info from PosAPI. Available also during workflow. False for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Determines whether it is a first login for the user based on last session info from PosAPI. Available also during workflow. False for anonymous user.")]
    Task<bool> GetFirstLoginAsync(ExecutionMode mode);

    /// <summary>
    /// True if there is trackerId stored in the session or trackerId cookie exists.
    /// </summary>
    [Obsolete("Instead check that User.TrackerId <> '' (is not empty string).")]
    [ValueVolatility(ValueVolatility.Client)]
    [Description("True if there is trackerId stored in the session or trackerId cookie exists.")]
    bool HasTracker();

    /// <summary>The trackerId either from query string (according to configured aliases) or from trackerId cookie.</summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The trackerId either from query string (according to configured aliases) or from trackerId cookie.")]
    string GetTrackerId();

    /// <summary>
    /// Indicates if the user is authenticated. False for user in the workflow.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Indicates if the user is authenticated. False for user in the workflow.")]
    bool LoggedIn();

    /// <summary>
    /// Indicates if the user was logged in before from particular device (has 'lastVisitor' cookie).
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Indicates if the user was logged in before from particular device (has 'lastVisitor' cookie).")]
    bool IsKnown();

    /// <summary>
    /// Indicates if the user has a real player claim from PosAPI. False for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Indicates if the user has a real player claim from PosAPI. False for anonymous user.")]
    bool IsRealPlayer();

    /// <summary>
    /// Indicates if the user is anonymous i.e. bet-station shop user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Indicates if the user is anonymous i.e. bet-station shop user.")]
    bool IsAnonymous();

    /// <summary>
    /// The loyalty category of authenticated user. Empty string in case of anonymous or workflow user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The loyalty category of authenticated user. Empty string in case of anonymous or workflow user.")]
    Task<string> GetLoyaltyStatusAsync(ExecutionMode mode);

    /// <summary>
    /// The loyalty points of authenticated user. The value is truncated integer. Type of points is according to the configuration. Negative number in case of anonymous or workflow user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description(
        "The loyalty points of authenticated user. The value is truncated integer. Type of points is according to the configuration. Negative number in case of anonymous or workflow user.")]
    Task<decimal> GetLoyaltyPointsAsync(ExecutionMode mode);

    /// <summary>
    /// ID of the country in claims that user has specified in the settings/registration.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("ID of the country in claims that user has specified in the settings/registration.")]
    string GetCountry();

    /// <summary>
    /// The language code from the user's Language claim e.g. EN.
    /// </summary>
    [Obsolete("Use Culture DSL provider instead.")]
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The language code from the user's Language claim e.g. EN.")]
    string GetLanguage();

    /// <summary>
    /// The name of the current culture resolved for the request corresponding to one selected in the language switcher e.g. en-US.
    /// </summary>
    [Obsolete("Use Culture.Current DSL provider instead.")]
    [Description("The name of the current culture resolved for the request corresponding to one selected in the language switcher e.g. en-US.")]
    string GetCulture();

    /// <summary>
    /// The Name claim of the current user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The Name claim of the current user.")]
    string GetLoginName();

    /// <summary>
    /// The number of visits of the user on the label. Value is increased on each new session. The value is counted also for non-registered visitors regardless of login. Initially starts with value 1 for the first visit.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description(
        "The number of visits of the user on the label. Value is increased on each new session. The value is counted also for non-registered visitors regardless of login. Initially starts with value 1 for the first visit.")]
    decimal GetVisitCount();

    /// <summary>
    /// The number of days since the last visit, independent if he was logged in or not. The value is tracked also for not-registered users. The numeric value is negative in case of first visit.
    /// </summary>
    [Description(
        "The number of days since the last visit, independent if he was logged in or not. The value is tracked also for not-registered users. The numeric value is negative in case of first visit.")]
    [ValueVolatility(ValueVolatility.Client)]
    decimal GetVisitAfterDays();

    /// <summary>
    /// Determines if authenticated or workflow user is a member of specified group. False for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Determines if authenticated or workflow user is a member of specified group. False for anonymous user.")]
    Task<bool> IsInGroupAsync(ExecutionMode mode, string groupName);

    /// <summary>
    /// The registration date of authenticated or workflow user. Empty string for anonymous user.
    /// </summary>
    [Obsolete("Instead user Registration.Date provider.")]
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The registration date of authenticated or workflow user. Date is in '" + UserDslProviderConstants.RegistrationDateFormat +
                 "' format. Empty string for anonymous user.")]
    Task<string> GetRegistrationDateAsync(ExecutionMode mode);

    /// <summary>
    /// The number of days elapsed from the registration date of authenticated or workflow user. Negative number for anonymous user.
    /// </summary>
    [Obsolete("Instead user Registration.DaysRegistered provider.")]
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The number of days elapsed from the registration date of authenticated or workflow user. Negative number for anonymous user.")]
    Task<decimal> GetDaysRegisteredAsync(ExecutionMode mode);

    /// <summary>
    /// The Tier Code of authenticated or workflow user obtained from PosAPI service. The value is truncated integer. Negative number for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The Tier Code of authenticated or workflow user obtained from PosAPI service. The value is truncated integer. Negative number for anonymous user.")]
    Task<decimal> GetTierCodeAsync(ExecutionMode mode);

    /// <summary>
    /// The affiliate ID (usually tracker ID) corresponding to registration of authenticated or workflow user. Empty string for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("The affiliate ID (usually tracker ID) corresponding to registration of authenticated or workflow user. Empty string for anonymous user.")]
    string GetAffiliateInfo();

    /// <summary>
    /// Returns the value of specified group's attribute for authenticated or workflow user. Empty string for anonymous user.
    /// </summary>
    [Description("Returns the value of specified group's attribute for authenticated or workflow user. Empty string for anonymous user.")]
    [ValueVolatility(ValueVolatility.Client)]
    Task<string> GetGroupAttributeAsync(ExecutionMode mode, string groupName, string attributeName);

    /// <summary>
    /// The last login time of authenticated or workflow user based on last session info from PosAPI. It is converted to user time zone. Empty string for anonymous user.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description(
        "The last login time of authenticated or workflow user based on last session info from PosAPI. It is converted to user time zone. Empty string for anonymous user.")]
    Task<string> GetLastLoginTimeFormattedAsync(ExecutionMode mode);

    /// <summary>
    /// Age of the user calculate based on dateOfBirth claim. -1 for anonymous user or if value of dateOfBirth claim is empty.
    /// </summary>
    [ValueVolatility(ValueVolatility.Client)]
    [Description("Age of the user calculate based on dateOfBirth claim. -1 for anonymous user or if value of dateOfBirth claim is empty.")]
    decimal GetAge();
}

internal static class UserDslProviderConstants
{
    public const string RegistrationDateFormat = "yyyy-MM-dd HH:mm:ss";
}
