using Frontend.Vanilla.Features.NativeApp;

namespace Frontend.Vanilla.Features.Cookies;

/// <summary>
/// Provides typed access to all cookie names.
/// </summary>
public static class CookieConstants
{
    /// <summary>
    /// Specifies current application domain (NOT current label domain). />.
    /// </summary>
    public const string? CurrentDomain = null;

    /// <summary>
    /// Used to store a referer id for a limited time to disable tracking.
    /// </summary>
    public const string TrackingAffiliate = "trackingAffiliate";

    /// <summary>
    /// Used to store a trackerId (aka WMId) passed via querystring "trackerId".
    /// </summary>
    public const string TrackerId = "trackerId";

    /// <summary>
    /// When bonus redirect suppressed we need to save trackerId in a cookie to be able show bonus notification afterwards.
    /// sbr goes for Suppress Bonus Redirects.
    /// </summary>
    public const string SuppressBonusRedirect = "sbr";

    /// <summary>
    /// Stores the <c>tdpeh</c> value.
    /// </summary>
    public const string Tdpeh = "tdpeh";

    /// <summary>
    /// Stores the AB test group.
    /// </summary>
    public const string AbTestGroup = "mmcore.bwinvar";

    /// <summary>
    /// Stores the information about what frontend is used on native application.
    /// </summary>
    public const string NativeApplication = "NativeApplication";

    /// <summary>
    /// Stores the information about which mobile native app the current request comes from.
    /// </summary>
    public const string NativeApp = NativeAppConstants.CookieName;

    /// <summary>
    /// Used to store the user name of the last visitor.
    /// </summary>
    public const string SuperCookie = "superCookie";

    /// <summary>
    /// Used to store sso token, so it can be used to login user.
    /// </summary>
    public const string SsoTokenCrossDomain = "ssoTokenCrossDomain";

    /// <summary>
    /// Used to store the authentication ticket.
    /// </summary>
    public const string Auth = "vnauth";

    /// <summary>
    /// Used to store the legacy Microsoft.Owin authentication ticket./>.
    /// </summary>
    public const string AuthLegacy = "vauth";

    /// <summary>
    /// Used to store DeviceId passed from device.
    /// </summary>
    public const string DeviceId = "deviceId";

    /// <summary>
    /// Used to store PostLoginValues.
    /// </summary>
    public const string PostLoginValues = "mobileLogin.PostLoginValues";

    /// <summary>
    /// Used to store the authentication ticket.
    /// </summary>
    public const string DisableHtmlInjection = "dhi";

    /// <summary>
    /// Indicates if the application is opened as Progressive Web App.
    /// </summary>
    public const string ProgressiveWebApp = "pwa";

    /// <summary>
    /// Language route value.
    /// </summary>
    public const string Lang = "lang";

    /// <summary>
    /// Indicates if the browser language is not supported.
    /// </summary>
    public const string UnsupportedBrowserLanguage = "unsupportedBrowserLanguage";

    /// <summary>
    /// Used to store the retail's Shop ID from the query string context.
    /// </summary>
    public const string ShopId = "shop_id";

    /// <summary>
    /// Used to store the retail's Terminal ID from the query string context.
    /// </summary>
    public const string TerminalId = "terminal_id";

    /// <summary>
    /// Indicates if the language is changed.
    /// </summary>
    public const string IsLanguageChanged = "isLanguageChanged";

    /// <summary>
    /// Used to store the user's login attempts.
    /// </summary>
    public const string LoginAttempts = "loginAttempts";

    /// <summary>
    /// The cookie banner that indicates the user has closed the alert box.
    /// </summary>
    public const string OptanonGroups = "vnOptanonGroups";
}
