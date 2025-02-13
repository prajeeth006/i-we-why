import { Injectable, Type } from '@angular/core';

import { isEqual } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LocalStoreKey } from '../browser/browser.models';
import { LocalStoreService } from '../browser/store/local-store.service';
import { getClientConfigProperties } from '../client-config/client-config.decorator';
import { ClientConfigDiff } from '../client-config/client-config.model';
import { ClientConfigService } from '../client-config/client-config.service';
import { Page } from '../client-config/page.client-config';
import { ClaimsConfig } from './claims.client-config';
import { ClaimTypeFullName } from './claims.models';
import { ClaimsService } from './claims.service';
import { UserEvent, UserLoginEvent, UserLogoutEvent, UserUpdateEvent } from './user-events';
import { UserConfig } from './user.client-config';

const userConfigKey = getClientConfigProperties(UserConfig).key;
const claimsConfigKey = getClientConfigProperties(ClaimsConfig).key;

/**
 * @whatItDoes Defines properties and base functionality for user service
 *
 * @description
 *
 * ## Properties
 *
 * This service encapsulates `ClaimsConfig` and `UserConfig`. It defines properties on top
 * of those configs.
 *
 * ## Update events
 *
 * The service will emit update events when underlying configs are updated. It will also include a diff which will be merged from
 * claims config diff (under exposed property names) and user config diff.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class UserServiceCore {
    private claimProperties = new Map<string, string>();
    private userEvents: Subject<UserEvent> = new Subject();

    constructor(
        private userConfig: UserConfig,
        private claimsService: ClaimsService,
        private page: Page,
        private clientConfigService: ClientConfigService,
        private localStoreService: LocalStoreService,
    ) {
        this.defineClaimProperty('id', ClaimTypeFullName.BackendUserId, '');
        this.defineClaimProperty('accountId', ClaimTypeFullName.AccountId, '');
        this.defineClaimProperty('globalSession', ClaimTypeFullName.GlobalSession, '');
        this.defineClaimProperty('username', ClaimTypeFullName.Username);
        this.defineClaimProperty('country', ClaimTypeFullName.Country, '');
        this.defineClaimProperty('geoCountry', ClaimTypeFullName.GeoCountry, '');
        this.defineClaimProperty('utcOffset', ClaimTypeFullName.UtcOffset, '0', Number);
        this.defineClaimProperty('currency', ClaimTypeFullName.Currency, '');
        this.defineClaimProperty('realPlayer', ClaimTypeFullName.RealPlayer, null, Boolean);
        this.defineClaimProperty('ssoToken', ClaimTypeFullName.SsoToken);
        this.defineClaimProperty('screenname', ClaimTypeFullName.Screenname);
        this.defineClaimProperty('title', ClaimTypeFullName.Title);
        this.defineClaimProperty('gamingDeclarationFlag', ClaimTypeFullName.GamingDeclarationFlag, '');
        this.defineClaimProperty('firstName', ClaimTypeFullName.FirstName);
        this.defineClaimProperty('lastName', ClaimTypeFullName.LastName);
        this.defineClaimProperty('email', ClaimTypeFullName.Email);
        this.defineClaimProperty('dateOfBirth', ClaimTypeFullName.DateOfBirth, null, Date);
        this.defineUserProperty('lang');
        this.defineUserProperty('balanceProperties');
        this.defineUserProperty('returning');
        this.defineUserProperty('loyalty');
        this.defineUserProperty('loyaltyPoints');
        this.defineUserProperty('customerId');
        this.defineUserProperty('segmentId');
        this.defineUserProperty('lifeCycleStage');
        this.defineUserProperty('eWarningVip');
        this.defineUserProperty('microSegmentId');
        this.defineUserProperty('churnRate');
        this.defineUserProperty('futureValue');
        this.defineUserProperty('potentialVip');
        this.defineUserProperty('isAuthenticated');
        this.defineUserProperty('isAnonymous');
        this.defineUserProperty('isFirstLogin', false);
        this.defineUserProperty('lastLoginTime');
        this.defineUserProperty('lastLoginTimeFormatted');
        this.defineUserProperty('workflowType');
        this.defineUserProperty('loginDuration');
        this.defineUserProperty('tierCode');
        this.defineUserProperty('userTimezoneUtcOffset');
        this.defineUserProperty('playerPriority');
        this.defineUserProperty('registrationDate');
        this.defineUserProperty('daysRegistered');
        this.defineUserProperty('visitCount');
        this.defineUserProperty('visitAfterDays');

        this.clientConfigService.updates.subscribe((diff: ClientConfigDiff) => {
            if (diff.has(getClientConfigProperties(UserConfig).key) || diff.has(getClientConfigProperties(ClaimsConfig).key)) {
                this.notify(diff);
            }
        });

        this.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => {
            this.localStoreService.set(LocalStoreKey.AuthStorageKey, 1);
        });

        this.events.pipe(filter((e: UserEvent) => e instanceof UserLogoutEvent)).subscribe(() => {
            this.localStoreService.set(LocalStoreKey.AuthStorageKey, 0);
        });
    }

    get events(): Observable<UserEvent> {
        return this.userEvents;
    }

    get claims(): ClaimsService {
        return this.claimsService;
    }

    get displayName(): string {
        for (const property of this.page.userDisplayNameProperties) {
            const value = (this as any)[property];
            if (value) {
                return value;
            }
        }

        return '';
    }

    triggerEvent(event: UserEvent) {
        this.userEvents.next(event);
    }

    private defineClaimProperty(name: string, claimType: string, defaultValue?: any, type?: Type<any>) {
        if (this.hasOwnProperty(name)) {
            throw new Error(`Cannot redefine property '${name}'.`);
        }

        if (this.claimProperties.has(claimType)) {
            throw new Error(`Claim '${claimType}' is already exposed as property '${this.claimProperties.get(claimType)}'.`);
        }

        Object.defineProperty(this, name, {
            get: () => {
                const value = this.claimsService.get(claimType) || defaultValue;
                if (value == null && type !== Boolean) {
                    return null;
                }

                if (type === Number) {
                    return parseInt(value, 10);
                } else if (type === Boolean) {
                    return value === 'True';
                } else if (type === Date) {
                    return new Date(value);
                } else {
                    return value;
                }
            },
            set: () => {
                throw new Error(`You cannot set claim property '${name}' directly. User ClientConfigService.reload or ClientConfigService.update.`);
            },
        });

        this.claimProperties.set(claimType, name);
    }

    private defineUserProperty(name: string, defaultValue?: any) {
        if (this.hasOwnProperty(name)) {
            throw new Error(`Cannot redefine property '${name}'.`);
        }

        Object.defineProperty(this, name, {
            get: () => {
                const value = this.userConfig[name];
                if (value == null && typeof defaultValue !== 'undefined') {
                    return defaultValue;
                }

                return value;
            },
            set: (value: any) => {
                if (!isEqual(this.userConfig[name], value)) {
                    this.userConfig[name] = value;

                    const diff = new Map<string, Map<string, any>>([[userConfigKey, new Map([[name, value]])]]);

                    this.notify(diff);
                }
            },
        });
    }

    private notify(diff: Map<string, Map<string, any>>) {
        const userDiff = diff.get(userConfigKey);
        const claimDiff = diff.get(claimsConfigKey);

        if (userDiff || claimDiff) {
            const combinedDiff = new Map<string, any>(userDiff || []);

            if (claimDiff) {
                claimDiff.forEach((_: any, claim: string) => {
                    const propertyName = this.claimProperties.get(claim);
                    if (propertyName) {
                        combinedDiff.set(propertyName, (this as any)[propertyName]);
                    }
                });
            }

            this.triggerEvent(new UserUpdateEvent(combinedDiff));
        }
    }
}
