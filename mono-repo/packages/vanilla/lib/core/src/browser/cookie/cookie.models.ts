import { SameSiteMode } from '../browser.models';

/**
 * @stable
 */
export enum CookieName {
    AbSocialLog = 'ab-social-log',
    AccountMenuDrawer = 'vn-am-drawer',
    ActivityPopupClosed = 'activitypopupclosed',
    AdditionalPostLoginOptions = 'additional-ccb-post-login-options',
    AmHiddenNudges = 'am-hidden-nudges',
    AppleUser = 'apple-user',
    ClsdL = 'clsd-l',
    ClsdP = 'clsd-p',
    ClsdS = 'clsd-s',
    DarkMode = 'dark-mode',
    DepositTooltip = 'depositTooltip',
    DepositTooltipDismissed = 'depositTooltipDismissed',
    DeviceDetails = 'deviceDetails',
    DeviceId = 'deviceId',
    DisplayedInterceptors = 'DisplayedInterceptors',
    Dpto = 'dpto',
    EntryUrl = 'entryUrl',
    EntryUrlReferrer = 'entryUrlReferrer',
    EuConsent = 'euconsent',
    GdAccepted = 'gdAccepted',
    GdReturnPath = 'gdReturnPath',
    GeoLocation = 'geolocation',
    HintQueue = 'hq',
    IdTokenHint = 'id_token_hint',
    IsLanguageChangedCookieName = 'isLanguageChanged',
    LastCoolOffProduct = 'lastCoolOffProduct',
    LastKnownProduct = 'lastKnownProduct',
    LastVisitor = 'lastVisitor',
    LdExperiment = 'vn-ld-exp',
    LoginHint = 'login_hint',
    LoginType = 'loginType',
    MmcoreBwinvar = 'mmcore.bwinvar',
    MobileLoginPostLoginValues = 'mobileLogin.PostLoginValues',
    NewVisitorPageOpted = 'vn-nv-opted',
    Nonce = 'nonce',
    OnBtt = 'onbtt',
    PfU = 'pf-u',
    PreviousPageUrl = 'vn-previousPageUrl',
    RedirectMsgShown = 'redirectMsgShown',
    RedirexOriginal = 'redirex-original',
    RmH = 'rm-h',
    RmI = 'rm-i',
    RmLp = 'rm-lp',
    RmMigrated = 'rm-migrated',
    Rurl = 'rurl',
    SessionLimits = 'sessionlimits',
    ShopId = 'shop_id',
    ShowChangeLabelSuccess = 'showChangeLabelSuccess',
    SkipUserLanguage = 'skipUserLanguage',
    SsoToken = 'ssoToken',
    StandaloneOverride = 'StandaloneOverride',
    StateChanged = 'vn-labelchanged',
    SuperCookie = 'superCookie',
    TerminalId = 'terminal_id',
    ThirdPartyTracker = 'thirdPartyTracker',
    ToastShownInStates = 'toastShownInStates',
    ToastrQueue = 'tq',
    TrackerId = 'trackerId',
    TrackingAffiliate = 'trackingAffiliate',
    UnsupportedBrowserLanguage = 'unsupportedBrowserLanguage',
    UserSummary = 'usersummary',
    VisitIdCookieName = '_ga',
    VnAuth = 'vnauth',
    VnLogin = 'vn-login',
    VnMenuReturnUrl = 'vn.MenuReturnUrl',
    VnOlc = 'vn-olc',
    VnOtc = 'vn-otc',
    VnOtd = 'vn-otd',
    VnOtslc = 'vn-otslc',
    VnSession = 'vnSession',
    VnLdSession = 'vn-ld-session',
    VnGeolocationTracking = 'vn-geolocation-tracking',
}

/**
 * @stable
 *
 * Object containing default options to pass when setting cookies.
 *
 * The object may have following properties:
 *
 * - **path** - {string} - The cookie will be available only for this path and its
 *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
 * - **domain** - {string} - The cookie will be available only for this domain and
 *   its sub-domains. For security reasons the user agent will not accept the cookie
 *   if the current domain is not a sub-domain of this domain or equal to it.
 * - **expires** - {string|Date} - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
 *   or a Date object indicating the exact date/time this cookie will expire.
 * - **secure** - {boolean} - If `true`, then the cookie will only be available through a
 *   secured connection.
 * - **httpOnly** - {boolean} - If `true`, then the cookie will be set with the `HttpOnly`
 *   flag, and will only be accessible from the remote server. Helps to prevent against
 *   XSS attacks.
 * - **sameSite** - {SameSiteMode} - Sets the `SameSite` value.
 * - **storeUnencoded** - {boolean} - If `true`, then the cookie value will not be encoded and
 *   will be stored as provided.
 */
export interface CookieOptions {
    sameSite?: SameSiteMode;
    path?: string;
    domain?: string;
    expires?: string | Date;
    secure?: boolean;
    httpOnly?: boolean;
    storeUnencoded?: boolean;
}
