import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LocalStoreKey, UserUpdateEvent, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { UserPreHooksLoginEvent } from '../../../core/src/user/user-events';
import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BalancePropertiesBootstrapService } from '../src/balance-properties-bootstrap.service';
import { BalancePropertiesCoreServiceMock } from './balance-properties-core.service.mock';
import { BalancePropertiesConfigMock } from './balance-properties.client-config.mock';
import { BalancePropertiesServiceMock } from './balance-properties.service.mock';

describe('BalancePropertiesBootstrapService', () => {
    let service: BalancePropertiesBootstrapService;
    let balancePropertiesConfigMock: BalancePropertiesConfigMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let userServiceMock: UserServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let localStoreServiceMock: LocalStoreServiceMock;
    let windowMock: WindowMock;
    let onFocusListener: Function;
    let onStorageListener: Function;
    let balancePropertiesCoreServiceMock: BalancePropertiesCoreServiceMock;

    beforeEach(() => {
        balancePropertiesConfigMock = MockContext.useMock(BalancePropertiesConfigMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);
        windowMock = new WindowMock();
        balancePropertiesCoreServiceMock = MockContext.useMock(BalancePropertiesCoreServiceMock);

        windowMock.addEventListener.and.callFake((type: string, callback: Function) => {
            if (type === 'focus') {
                onFocusListener = callback;
            } else if (type === 'storage') {
                onStorageListener = callback;
            } else {
                throw new Error(`Unexpected event: ${type}.`);
            }
        });

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                BalancePropertiesBootstrapService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(BalancePropertiesBootstrapService);
    });

    function init() {
        service.onFeatureInit();
        balancePropertiesConfigMock.whenReady.next();
        balancePropertiesConfigMock.balanceProperties = <any>{
            accountBalance: 200,
        };
        tick();
    }

    describe('onFeatureInit', () => {
        it('should set balance properties', fakeAsync(() => {
            init();

            expect(balancePropertiesCoreServiceMock.set).toHaveBeenCalledOnceWith(balancePropertiesServiceMock);
        }));

        describe('on balance refresh', () => {
            it('should track and trigger UserUpdateEvent', fakeAsync(() => {
                init();

                balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 100 });
                tick();

                expect(userServiceMock.triggerEvent).toHaveBeenCalledOnceWith(
                    new UserUpdateEvent(new Map([['balanceProperties', { accountBalance: 100 }]])),
                );
                expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Balance_Refresh', {
                    'user.profile.bal': 100,
                    'user.profile.previousBal': 200,
                });
            }));
        });

        describe('on focus event', () => {
            it('should refresh balance', fakeAsync(() => {
                init();

                onFocusListener();

                expect(balancePropertiesServiceMock.refresh).toHaveBeenCalledTimes(1);
            }));
        });

        describe('on UserLoginEvent event', () => {
            it('should refresh balance', fakeAsync(() => {
                init();

                userServiceMock.triggerEvent(new UserPreHooksLoginEvent());

                expect(balancePropertiesServiceMock.refresh).toHaveBeenCalledTimes(1);
            }));
        });

        describe('on storage event', () => {
            it('should do nothing if sessionStorage event', fakeAsync(() => {
                init();

                onStorageListener({ storageArea: sessionStorage });

                expect(localStoreServiceMock.get).not.toHaveBeenCalled();
            }));

            it('should not refresh balance if authKey value is 1', fakeAsync(() => {
                localStoreServiceMock.get.and.returnValue(1);
                init();

                onStorageListener({ storageArea: localStorage });

                expect(localStoreServiceMock.get).toHaveBeenCalledWith(LocalStoreKey.AuthStorageKey);
                expect(balancePropertiesServiceMock.refresh).not.toHaveBeenCalled();
            }));

            it('should refresh balance if authKey value is 0', fakeAsync(() => {
                localStoreServiceMock.get.and.returnValue(0);
                init();

                onStorageListener({ storageArea: localStorage });

                expect(localStoreServiceMock.get).toHaveBeenCalledOnceWith(LocalStoreKey.AuthStorageKey);
                expect(balancePropertiesServiceMock.refresh).toHaveBeenCalledTimes(1);
            }));
        });

        describe('on UPDATE_BALANCE event', () => {
            it('should call api to refresh balance', fakeAsync(() => {
                init();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'UPDATE_BALANCE' });
                tick();

                expect(balancePropertiesServiceMock.refresh).toHaveBeenCalledTimes(1);
            }));
        });

        describe('on GET_BALANCE event', () => {
            it('should send event containing balance and currency back to native app', fakeAsync(() => {
                userServiceMock.currency = 'EUR';
                init();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'GET_BALANCE' });
                tick();

                expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                    eventName: 'UserBalance',
                    parameters: { amount: 200, currencyCode: 'EUR' },
                });
            }));
        });
    });
});
