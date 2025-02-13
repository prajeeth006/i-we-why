import { IndividualConfig } from 'ngx-toastr';

/**
 * @stable
 */
export enum ToastrSchedule {
    Immediate = 'immediate',
    AfterNextNavigation = 'afterNextNavigation',
}

/**
 * @stable
 */
export enum ToastrType {
    AutoLogoutMultipleActiveSessions = 'autologoutmultipleactivesessions',
    BigBalance = 'bigbalance',
    ChangeLabel = 'changelabel',
    ChangeLabelSuccess = 'changelabelsuccess',
    ConfirmPasswordError = 'confirmpassworderror',
    CopyToClipboard = 'copytoclipboard',
    DepositPrompt = 'depositprompt',
    GermanAnnualKycVerifiedSuccess = 'GermanAnnualKycVerifiedSuccess',
    KycVerifiedSuccess = 'KycVerifiedSuccess',
    LastSessionInfo = 'lastsessioninfo',
    LinkAccount = 'linkAccount',
    LoginLimits = 'loginlimits',
    LogoutWarning = 'logoutwarning',
    MigratedPlayerOnboarding = 'migratedplayeronboarding',
    PlayBreakActive = 'playbreakactive',
    PlayBreakActiveLongSession = 'playbreakactivelongsession',
    PlayBreakConfirmation = 'playbreakconfirmation',
    PlayBreakConfirmationDelayed = 'playbreakconfirmationdelayed',
    PlayBreakConfirmationDelayedLongSession = 'playbreakconfirmationdelayedlongsession',
    PlayBreakConfirmationLongSession = 'playbreakconfirmationlongsession',
    PlayBreakGracePeriod = 'playbreakgraceperiod',
    PlayBreakGracePeriodLongSession = 'playbreakgraceperiodlongsession',
    RestrictedAccess = 'restrictedaccess',
    SingleAccount = 'singleaccount',
    UpdateBrowser = 'updatebrowser',
}

/**
 * Options for {@link ToastrQueueService}.
 *
 * @stable
 */
export interface ToastrQueueOptions {
    schedule: ToastrSchedule;
    placeholders: { [key: string]: string };
    customToastr?: CustomToastrQueueItem;
}

/**
 * Options for {@link CustomToastrQueueItem}.
 *
 * @experimental
 */
export interface CustomToastrQueueItem {
    /** custom component name that is register with {@link ToastrDynamicComponentsRegistry} */
    customComponent: string;
    /** type of icon class: info, error, success, warning */
    type?: string;
    title?: string;
    message?: string;
    /** individual toast options */
    parameters?: Partial<IndividualConfig>;
}

export interface ToastrQueueItem {
    name: string;
    schedule: ToastrSchedule;
    p?: { [key: string]: string };
    customToastr?: CustomToastrQueueItem;
}

export interface ToastrItem {
    type?: string;
    title?: string;
    message?: string;
    options?: Partial<IndividualConfig>;
}
