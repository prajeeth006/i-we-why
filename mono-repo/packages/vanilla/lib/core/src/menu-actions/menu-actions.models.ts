/**
 * @stable
 */
export enum MenuAction {
    CLOSE_TOASTR = 'closeToastr',
    DEPOSIT_PROMPT_ACTION = 'depositPromptAction',
    GOTO_CASHIER = 'gotoCashier',
    GOTO_DEPOSIT = 'gotoDeposit',
    GOTO_HOME = 'gotoHome',
    GOTO_INBOX = 'gotoInbox',
    GOTO_LIVE_CHAT = 'gotoLiveChat',
    GOTO_LOGIN = 'gotoLogin',
    GOTO_MANAGE_MY_CARDS = 'gotoManageMyCards',
    GOTO_PAYMENT_PREFERENCES = 'gotoPaymentPreferences',
    GOTO_PRE_LOGIN = 'goToPreLogin',
    GOTO_RATE_THE_APP = 'gotoRateTheApp',
    GOTO_REGISTRATION = 'gotoRegistration',
    GOTO_SETTINGS = 'gotoSettings',
    GOTO_TRANSACTION_HISTORY = 'gotoTransactionHistory',
    GOTO_URL_WITH_SSO = 'gotoUrlWithSso',
    GOTO_WITHDRAWAL = 'gotoWithdrawal',
    GO_BACK = 'goBack',
    HEADER_BALANCE_ACTION = 'headerBalanceAction',
    LOGIN_AND_GOTO = 'loginAndGoto',
    LOGOUT = 'logout',
    OPEN_ACCOUNT_MENU_ONBOARDING_TOUR = 'openAccountMenuOnboardingTour',
    OPEN_DIALOG = 'openDialog',
    OPEN_IN_NEW_WINDOW = 'openInNewWindow',
    OPEN_ZENDESK_CHAT = 'openZendeskChat',
    RELOAD = 'reload',
    REMIND_ME_LATER_ACTION = 'remaindMeLaterAction',
    REMOVE_QUERY_STRING = 'removeQueryString',
    SEARCH_ICON_CLICK = 'searchIconClick',
    SELECT_FILTER_PILL = 'selectFilterPill',
    SELECT_NAVIGATION_PILL = 'selectNavigationPill',
    SEND_TO_NATIVE = 'sendToNative',
    SET_QUERY_STRING = 'setQueryString',
    SHOW_LABEL_SWITCHER_OVERLAY = 'showLabelSwitcherOverlay',
    SHOW_TUTORIAL = 'showTutorial',
    TOGGLE_ACCOUNT_MENU = 'toggleAccountMenu',
    TOGGLE_BALANCE_BREAKDOWN = 'toggleBalanceBreakdown',
    TOGGLE_BOTTOM_SHEET = 'toggleBottomSheet',
    TOGGLE_LABEL_SWITCHER = 'toggleLabelSwitcher',
    TOGGLE_LANGUAGE_SWITCHER = 'toggleLanguageSwitcher',
    TOGGLE_PRODUCT_MENU = 'toggleProductMenu',
    TOGGLE_RANGE_DATEPICKER = 'toggleRangeDatepicker',
    TOGGLE_REFERRED_FRIENDS = 'toggleReferredFriends',
}

/**
 * @whatItDoes Defines origins for {@link MenuActionsService#origin}.
 *
 * @stable
 */
export enum MenuActionOrigin {
    PageMatrix = 'PageMatrix',
    Menu = 'Menu',
    Header = 'Header',
    Footer = 'Footer',
    BottomNav = 'BottomNav',
    BottomSheet = 'BottomSheet',
    OfferButton = 'OfferButton',
    Misc = 'Misc',
    BalanceBreakdown = 'BalanceBreakdown',
    Login = 'Login',
}

/**
 * Defines callback signature for {@link MenuActionsService#register}.
 *
 * @stable
 */
export interface MenuActionHandler {
    (origin: string, ...args: any[]): string | void | Promise<void>;
}

/**
 * @stable
 */
export interface MenuActionItem {
    clickAction?: string;
    url?: string;
    target?: string;
    text?: string;
    class?: string;
    name?: string;
    trackEvent?: { eventName: string; data: any; await?: string };
    parameters?: { [key: string]: string };
    webAnalytics?: string;
}

/**
 * @stable
 */
export interface MenuActionParameters {
    origin?: string;
    url?: string;
    target?: string;
    parameters?: { [key: string]: string };
}
