import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NativeAppConfigMock, NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { WrapperSettings, WrapperSettingsService } from '../src/wrapper-settings.service';

describe('WrapperSettingsService', () => {
    let service: WrapperSettingsService;
    let nativeAppServiceMock: NativeAppServiceMock;
    let nativeAppSettingsConfigMock: NativeAppConfigMock;

    let settings: WrapperSettings;

    beforeEach(() => {
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        nativeAppSettingsConfigMock = MockContext.useMock(NativeAppConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, WrapperSettingsService],
        });

        nativeAppServiceMock.isNativeWrapper = true;
        nativeAppSettingsConfigMock.appSettingsTimeout = 5000;
        service = TestBed.inject(WrapperSettingsService);

        settings = <WrapperSettings>{
            deviceTouchSupported: true,
        };

        nativeAppServiceMock.sendToNative.and.returnValue(undefined);
        nativeAppServiceMock.sendToNative.withArgs({ eventName: NativeEventType.GET_APPLICATION_SETTINGS }).and.callFake(() => {
            nativeAppServiceMock.eventsFromNative.next({
                eventName: NativeEventType.SET_APPLICATION_SETTINGS,
                parameters: settings,
            });
        });
    });

    describe('load()', () => {
        it('should load settings from native', waitForAsync(() => {
            service.load().then(() => {
                expect(service.current).toBe(settings);
            });
        }));

        it('should not load settings for non native app', waitForAsync(() => {
            nativeAppServiceMock.isNativeWrapper = false;

            service.load().then(() => {
                expect(nativeAppServiceMock.sendToNative).not.toHaveBeenCalled();
                expect(service.current).toEqual(<any>{});
            });
        }));

        it('should resolve after timeout if response is not received', fakeAsync(() => {
            nativeAppServiceMock.sendToNative.withArgs({ eventName: NativeEventType.GET_APPLICATION_SETTINGS }).and.callFake(() => {});

            const errorSpy = jasmine.createSpy();
            service.load().then(errorSpy);

            expect(errorSpy).not.toHaveBeenCalled();
            tick(4999);
            expect(errorSpy).not.toHaveBeenCalled();
            tick(1);
            expect(errorSpy).toHaveBeenCalled();
            expect(service.current).toEqual(<any>{});
        }));
    });

    describe('update()', () => {
        it('should update wrapper settings', waitForAsync(() => {
            service.load().then(() => {
                service.update({ keepMeSignedInEnabled: true });

                expect(service.current.keepMeSignedInEnabled).toBeTrue();
                expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                    eventName: NativeEventType.UPDATE_APPLICATION_SETTINGS,
                    parameters: { keepMeSignedInEnabled: true },
                });
            });
        }));

        it('should not update settings for non native app', () => {
            nativeAppServiceMock.isNativeWrapper = false;

            service.update({ keepMeSignedInEnabled: true });

            expect(nativeAppServiceMock.sendToNative).not.toHaveBeenCalled();
        });
    });

    describe('applicationSettingsFired', () => {
        it('should return true when is not native wrapper app', () => {
            nativeAppServiceMock.isNativeWrapper = false;
            const spy = jasmine.createSpy();

            service.applicationSettingsFired.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(true);
        });

        it('should load settings from native', waitForAsync(() => {
            const spy = jasmine.createSpy();

            service.applicationSettingsFired.subscribe(spy);

            service.load().then(() => {
                expect(spy).toHaveBeenCalledWith(true);
            });
        }));
    });
});
