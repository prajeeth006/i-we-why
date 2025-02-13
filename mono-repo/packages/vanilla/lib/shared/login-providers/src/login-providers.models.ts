import { LoginProvider, ParsedUrl } from '@frontend/vanilla/core';
import { ProviderParameters } from '@frontend/vanilla/shared/login';

import AppleLoginOptions = AppleSignInAPI.ClientConfigI;
import FacebookLoginOptions = facebook.LoginOptions;
import GoogleLoginOptions = gapi.auth2.SigninOptions;

import SigninOptions = gapi.auth2.SigninOptions;

/**
 * @stable
 */
export interface ProviderLoginOptions {
    provider: LoginProvider;
    loginOptions?: AppleLoginOptions | FacebookLoginOptions | GoogleLoginOptions;
    queryParams?: { [key: string]: string };
    redirectQueryParams?: { [key: string]: string };
}

/**
 * @internal
 */
export interface AuthUrl {
    url: ParsedUrl | null;
    redirectUrl: ParsedUrl | null;
}

/**
 * @internal
 */
export interface AuthOptions {
    authUrl: AuthUrl;
    providerParameters: ProviderParameters | undefined;
    signInOptions?: SigninOptions | undefined; // Optional undefined
}

/**
 * @internal
 */
export interface AuthResponse<T> {
    options: AuthOptions;
    response?: T;
    error?: any;
}

/**
 * @internal
 */
export interface FacebookProfileData {
    name: string;
    picture: {
        data: {
            url: string;
        };
    };
}
