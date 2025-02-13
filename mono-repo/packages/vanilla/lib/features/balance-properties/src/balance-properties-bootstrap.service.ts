import { Injectable, NgZone, inject } from '@angular/core';

import {
    BalanceProperties,
    BalancePropertiesCoreService,
    LocalStoreKey,
    LocalStoreService,
    NativeAppService,
    NativeEvent,
    NativeEventType,
    OnFeatureInit,
    TrackingService,
    UserPreHooksLoginEvent,
    UserService,
    UserUpdateEvent,
    WINDOW,
    WindowEvent,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BalancePropertiesConfig } from './balance-properties.client-config';
import { BalancePropertiesService } from './balance-properties.service';

@Injectable()
export class BalancePropertiesBootstrapService implements OnFeatureInit {
    readonly #window = inject(WINDOW);

    constructor(
        private balancePropertiesService: BalancePropertiesService,
        private balancePropertiesConfig: BalancePropertiesConfig,
        private userService: UserService,
        private nativeAppService: NativeAppService,
        private localStoreService: LocalStoreService,
        private zone: NgZone,
        private trackingService: TrackingService,
        private balancePropertiesCoreService: BalancePropertiesCoreService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.balancePropertiesConfig.whenReady);

        this.balancePropertiesService.update(this.balancePropertiesConfig.balanceProperties);
        this.balancePropertiesCoreService.set(this.balancePropertiesService);
        //Necessary for betstation gridconnect login as it's a new login on top of anonymous user.
        this.userService.events.pipe(filter((e) => e instanceof UserPreHooksLoginEvent)).subscribe(() => {
            this.balancePropertiesService.refresh();
        });

        this.zone.runOutsideAngular(() => {
            // Refresh balance on focus but do not propagate it to other balances.
            this.#window.addEventListener(WindowEvent.Focus, () => {
                if (this.userService.isAuthenticated) {
                    this.balancePropertiesService.refresh(false);
                }
            });

            this.#window.addEventListener(WindowEvent.Storage, (event: StorageEvent) => {
                if (event.storageArea == localStorage) {
                    const authKey = this.localStoreService.get<number>(LocalStoreKey.AuthStorageKey);

                    if (authKey === 0 && this.userService.isAuthenticated) {
                        this.balancePropertiesService.refresh();
                    }
                }
            });
        });

        this.nativeAppService.eventsFromNative.subscribe((e: NativeEvent) => {
            const eventName = e.eventName.toUpperCase();
            if (eventName === NativeEventType.GETBALANCE) {
                this.nativeAppService.sendToNative({
                    eventName: NativeEventType.USERBALANCE,
                    parameters: {
                        amount: this.balancePropertiesConfig.balanceProperties.accountBalance,
                        currencyCode: this.userService.currency,
                    },
                });
            } else if (eventName === NativeEventType.UPDATEBALANCE) {
                this.balancePropertiesService.refresh();
            }
        });

        this.balancePropertiesService.balanceProperties.pipe(filter(Boolean)).subscribe((balance: BalanceProperties) => {
            this.userService.triggerEvent(new UserUpdateEvent(new Map([['balanceProperties', balance]])));

            this.trackingService.triggerEvent('Event.Balance_Refresh', {
                'user.profile.bal': balance.accountBalance,
                'user.profile.previousBal': this.balancePropertiesConfig.balanceProperties.accountBalance,
            });
        });
    }
}
