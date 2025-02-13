import { GoToOptions } from '../../navigation/navigation.models';

/**
 * @whatItDoes Provides additional login handling options
 *
 * @stable
 */
export interface LoginResponseOptions extends GoToOptions {
    skipRememberMeSetup?: boolean;
    additionalPostLoginCcbParameters?: { [key: string]: string };
    skipInterceptorTracking?: boolean;
}
