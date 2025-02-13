import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ClaimsService } from './claims.service';
import { UserServiceCore } from './user-core.service';
import { UserEvent } from './user-events';

/**
 * @whatItDoes Defines strongly typed properties for UserService.
 *
 * @description
 *
 * Actual implementation and definition of properties is done in `UserServiceCore`.
 *
 * @stable
 *
 */
@Injectable({
    providedIn: 'root',
    useExisting: UserServiceCore,
})
export class UserService {
    /**
     * Allows to subscribe to user events.
     */
    events: Observable<UserEvent>;
    /**
     * Exposes raw claims.
     */
    claims: ClaimsService;
    /**
     * They display name of the user. The property that is returned can be specified in dynacon.
     */
    displayName: string;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`
     */
    id: string | null;
    /**
     * claim `http://api.bwin.com/v3/user/pg/nameidentifier`
     */
    accountId: string | null;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`
     */
    username: string | null;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country`
     */
    country: string;
    /**
     * claim `http://api.bwin.com/v3/geoip/country`
     */
    geoCountry: string | null;
    /**
     * claim `http://api.bwin.com/v3/user/pg/globalsession`
     */
    globalSession: string | null;
    /**
     * claim `http://api.bwin.com/v3/user/utcoffset` as `Number`
     */
    utcOffset: number;
    /**
     * claim `http://api.bwin.com/v3/user/currency`
     */
    currency: string;
    /**
     * claim `http://api.bwin.com/v3/user/realplayer` as `Boolean`
     */
    realPlayer: boolean;
    /**
     * claim `http://api.bwin.com/v3/user/ssotoken`
     */
    ssoToken: string | null;
    /**
     * claim `http://api.bwin.com/v3/user/screenname`
     */
    screenname: string | null;
    /**
     * claim `http://api.bwin.com/v3/user/gamingDeclarationFlag`
     */
    gamingDeclarationFlag: string | null;
    /**
     * claim `http://api.bwin.com/v3/user/title`
     */
    title: string | null;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`
     */
    firstName: string | null;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`
     */
    lastName: string | null;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email`
     */
    email: string | null;
    /**
     * claim `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth` as `Date`
     */
    dateOfBirth: Date | null;
    /**
     * user config property `lang`
     */
    lang: string;
    /**
     * user config property `returning`
     */
    returning: boolean;
    /**
     * user config property `loyalty`
     */
    loyalty: string | null;
    /**
     * user config property `loyaltyPoints`
     */
    loyaltyPoints: number | null;
    /*
     * user config property `customerId`
     */
    customerId: number;
    /*
     * user config property `segmentId`
     */
    segmentId: number;
    /*
     * user config property `lifeCycleStage`
     */
    lifeCycleStage: string | null;
    /*
     * user config property `eWarningVip`
     */
    eWarningVip: string | null;
    /*
     * user config property `microSegmentId`
     */
    microSegmentId: number;
    /*
     * user config property `churnRate`
     */
    churnRate: number;
    /*
     * user config property `futureValue`
     */
    futureValue: number;
    /*
     * user config property `potentialVip`
     */
    potentialVip: number;
    /*
     * user config property `potentialVip`
     */
    tierCode: number;
    /**
     * user config property `isAuthenticated`
     */
    isAuthenticated: boolean;
    /**
     * user config property `isAnonymous`. For Terminal only.
     */
    isAnonymous: boolean;
    /**
     * user config property `isFirstLogin`
     */
    isFirstLogin: boolean;
    /**
     * user config property `userTimezoneUtcOffset`
     */
    userTimezoneUtcOffset: number;
    /**
     * user config property `lastLoginTime`
     */
    lastLoginTime?: string;
    /**
     * user config property `lastLoginTimeFormatted`
     */
    lastLoginTimeFormatted?: string | undefined; // Optional undefined
    /**
     * user config property `workflowType`
     */
    workflowType: number;
    /**
     * user config property `loginDuration`
     */
    loginDuration: number | null;
    /*
     * user config property `playerPriority`
     */
    playerPriority: string | null;
    /*
     * user config property `registrationDate`
     */
    registrationDate: Date;
    /*
     * user config property `daysRegistered`
     */
    daysRegistered: number;
    /**
     * user config property `visitCount`
     */
    visitCount: string;
    /**
     * user config property `visitAfterDays`
     */
    visitAfterDays: string;

    /**
     * Triggers an event.
     *
     * ```
     * userService.triggerEvent(new UserLoginEvent());
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    triggerEvent(_event: UserEvent) {
        // This is intentional
    }
}
