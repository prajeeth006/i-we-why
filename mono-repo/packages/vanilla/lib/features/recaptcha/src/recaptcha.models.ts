/**
 * @stable
 */
export enum RecaptchaAction {
    PageLoad = 'pageLoad',
    AutoLogin = 'autoLogin',
}

export interface RecaptchaProperties {
    'sitekey': string;
    'size': string;
    'theme': string;
    'callback': (token: string) => void;
    'expired-callback': () => void;
    'error-callback': (error: string) => void;
}
