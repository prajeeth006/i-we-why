import { Injectable, inject } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { BalancePropertiesCoreService } from '../lazy/service-providers/balance-properties-core.service';
import { NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { ClaimType } from '../user/user.models';
import { UserService } from '../user/user.service';
import { RememberMeService } from './remember-me.service';

@Injectable({
    providedIn: 'root',
})
export class PostLoginService {
    private balancePropertiesCoreService = inject(BalancePropertiesCoreService);
    private userService = inject(UserService);
    private rememberMeService = inject(RememberMeService);
    private cookieService = inject(CookieService);
    private nativeAppService = inject(NativeAppService);

    async sendPostLoginEvent(postLoginValues?: { [key: string]: string }, additionalPostLoginCcbParameters?: { [key: string]: string }) {
        await firstValueFrom(this.balancePropertiesCoreService.whenReady);

        const parameters = {
            accountBalance: this.userService.isAuthenticated ? this.balancePropertiesCoreService.balanceInfo?.accountBalance : 0,
            accountCurrency: this.userService.currency,
            accountId: this.userService.accountId,
            language: this.userService.lang,
            sessionToken: this.userService.claims.get(ClaimType.SessionToken),
            ssoToken: this.userService.ssoToken,
            countryCode: this.userService.country,
            nameIdentifier: this.userService.id,
            userToken: this.userService.claims.get(ClaimType.UserToken),
            timeStamp: new Date().valueOf(),
            screenName: this.userService.screenname,
            workflowType: this.userService.workflowType,
            email: this.userService.claims.get(ClaimType.Email),
            birthDate: this.userService.claims.get(ClaimType.DateOfBirth),
            userName: this.userService.username,
            firstName: this.userService.claims.get(ClaimType.GivenName),
            lastName: this.userService.claims.get(ClaimType.Surname),
            secondLastName: this.userService.claims.get(ClaimType.SecondSurname),
            postLoginValues: postLoginValues ?? {},
            superCookie: this.cookieService.get(CookieName.SuperCookie) || '',
            lastLoginTime: this.userService.lastLoginTime,
            rememberMeEnabled: this.rememberMeService.tokenExists(),
        };

        this.nativeAppService.sendToNative({
            eventName: NativeEventType.POSTLOGIN,
            parameters: Object.assign(parameters, additionalPostLoginCcbParameters ?? {}),
        });
    }
}
