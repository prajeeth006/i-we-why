import { MenuActionParameters } from '../menu-actions/menu-actions.models';
import { Message } from '../messages/message.models';
import { GoToOptions } from '../navigation/navigation.models';
import { ParsedUrl } from '../navigation/parsed-url';
import { BalanceProperties } from '../user/user.models';

/**
 * @stable
 */
export enum LoginType {
    Manual = 'Manual',
    Autologin = 'Autologin',
    OAuthId = 'OAuthId',
    ConnectCard = 'Card',
}

/**
 * @whatItDoes Indicates the way the login dialog is closed
 *
 * @experimental
 */
export enum LoginDialogCloseType {
    CloseButton = 'CloseButton',
    LoginOrNavigation = 'LoginOrNavigation',
}

/**
 * @whatItDoes Maps to {@link http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={42438665-09BD-4654-833F-4704A359A73B}&la=} items.
 *
 * @stable
 */
export enum LoginMessageKey {
    AutoLoginErrorTouch = 'autologinerrortouch',
    AutoLoginError = 'autologinerror',
    Inactivity = 'inactivity',
    FaceId = 'faceid',
}

/**
 * @stable
 */
export enum FastLoginValue {
    KeepMeSignedInEnabled = 'KeepMeSignedInEnabled',
    IsTouchIDEnabled = 'IsTouchIDEnabled',
    IsFaceIDEnabled = 'IsFaceIDEnabled',
    FastLoginDisabled = 'FastLoginDisabled',
}

/**
 * @stable
 */
export enum LoginProvider {
    FACEBOOK = 'facebook',
    YAHOO = 'yahoo',
    GOOGLE = 'google',
    APPLE = 'apple',
    PAYPAL = 'paypal',
    ITSME = 'itsme',
}

/**
 * @whatItDoes Represents login response
 *
 * @stable
 */
export interface LoginResponse {
    /** Indicates if login is completed. False if user is in workflow state */
    isCompleted?: boolean;
    /** Indicates the url user will be redirect to */
    redirectUrl?: string;
    /** PostLoginValues */
    postLoginValues?: { [key: string]: any };
    /** Indicates the redirect action to be executed */
    action?: string;
    /** Indicates if remember me is enabled */
    rememberMeEnabled?: boolean;
    user?: {
        isAuthenticated: boolean;
        loyaltyCategory?: string;
    };
    claims?: { [key: string]: any };
    balance?: BalanceProperties;
}

/**
 * @whatItDoes Represents options when opening login dialog
 *
 * @stable
 */
export interface ResponsiveLoginDialogOptions {
    /** Url to open after successful login */
    returnUrl?: string | null;
    /** Token to identify the opener of the dialog */
    openedBy?: string;
    /** Login entry message key to set at the login dialog page */
    loginMessageKey?: string;
    /** Whether the dialog should focus the first focusable element on open. */
    autoFocus?: boolean;
    /** Whether the dialog should restore focus to the previously-focused element, after it's closed */
    restoreFocus?: boolean;
    /** Username */
    username?: string;
}

/**
 * @whatItDoes Represents result data returned by login dialog.
 *
 * @stable
 */
export interface LoginDialogData extends ResponsiveLoginDialogOptions {
    closeType?: string;
}

/**
 * @stable
 */
export interface DeviceFingerPrint {
    superCookie?: string;
    deviceDetails?: { [key: string]: any };
}

/**
 * @stable
 */
export interface AutoLoginParameters {
    username: string;
    password: string;
    dateOfBirth: Date | undefined;
    isTouchIDEnabled?: boolean;
    isFaceIDEnabled?: boolean;
    rememberme?: boolean;
}

/**
 * @stable
 */
export interface SsoAutoLoginParameters {
    ssoToken: string;
    isTouchIDEnabled?: boolean;
    isFaceIDEnabled?: boolean;
}

export interface LoginDialogOptions {
    positionStyle: { top?: string | null; right?: string | null; bottom?: string | null; left?: string | null };
}

/**
 * @stable
 */
export interface LoginFailedOptions {
    reason?: LoginFailedReason;
    type?: LoginType;
    touchIdOrFaceIdEnabled?: boolean;
}

/**
 * @stable
 */
export interface LoginFailedReason {
    errorCode: string;
    errorValues?: { [key: string]: any };
    posApiErrorMessage?: string;
    vnMessages?: Message[];
    redirectUrl?: string;
}

export interface FastLoginField {
    text: string | undefined;
    checked?: boolean;
    value: FastLoginValue;
}

/**
 * @stable
 */
export interface LoginOption {
    id: string;
    label: string;
    selected?: boolean;
}

/**
 * @stable
 */
export interface LoginRedirectInfo {
    url: ParsedUrl | undefined;
    options?: GoToOptions;
    isCompleted: boolean;
    goTo: (options?: GoToOptions) => void;
}

/**
 * @stable
 */
export interface ConnectCardLoginEvent {
    connectCardNumber: string;
    pin: number;
    rememberme: boolean;
    captcharesponse: string;
    loginType: string;
}

/**
 * @stable
 */
export interface LoginOAuthDialogData {
    authorizationCode: string;
    oAuthProvider: string;
    oAuthUserId: string | null;
    requestData: { [key: string]: string };
}

/**
 * @stable
 */
export interface LoginProviderProfile extends MenuActionParameters {
    provider: LoginProvider;
    name?: string;
    pictureUrl?: string;
}

/**
 * @stable
 */
export interface WorkflowResponse {
    /**
     * Holds login error. Will be null if login succeed.
     * NOTE: if it contains redirectUrl it will redirect so data might not be returned.
     * */
    loginError?: any;
}

/**
 * @stable
 */
export interface WorkflowHandleResponse extends WorkflowResponse {
    /** Holds successful login response. Will be null if login failed. */
    loginResponse?: LoginResponse;
    /** Holds login redirect info. Will be null if login failed. */
    loginRedirectInfo?: LoginRedirectInfo;
}

export interface PostLoginActionHandler {
    (origin: string, ...args: any[]): void | Promise<void>;
}
