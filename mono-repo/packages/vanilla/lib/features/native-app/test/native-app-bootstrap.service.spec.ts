import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { WrapperSettings } from '@frontend/vanilla/shared/native-app';
import { MockContext } from 'moxxi';

import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { NativeAppConfigMock } from '../../../core/test/native-app/native-app.mock';
import { WrapperSettingsServiceMock } from '../../../shared/native-app/test/wrapper-settings.mock';
import { NativeAppBootstrapService } from '../src/native-app-bootstrap.service';
import { NativeAutoPingServiceMock } from './native-auto-ping.mock';
import { WrapperEmulatorServiceMock } from './wrapper-emulator.mock';

describe('NativeAppBootstrapService', () => {
    let service: NativeAppBootstrapService;
    let nativeAutoPingServiceMock: NativeAutoPingServiceMock;
    let nativeAppSettingsConfigMock: NativeAppConfigMock;
    let localStoreServiceMock: LocalStoreServiceMock;
    let wrapperSettingsServiceMock: WrapperSettingsServiceMock;
    let wrapperEmulatorServiceMock: WrapperEmulatorServiceMock;

    beforeEach(() => {
        nativeAutoPingServiceMock = MockContext.useMock(NativeAutoPingServiceMock);
        nativeAppSettingsConfigMock = MockContext.useMock(NativeAppConfigMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);
        wrapperSettingsServiceMock = MockContext.useMock(WrapperSettingsServiceMock);
        wrapperEmulatorServiceMock = MockContext.useMock(WrapperEmulatorServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, NativeAppBootstrapService],
        });

        service = TestBed.inject(NativeAppBootstrapService);
    });

    it('should init auto ping', () => {
        service.onFeatureInit();

        expect(nativeAutoPingServiceMock.init).toHaveBeenCalled();
    });

    describe('wrapper emulation', () => {
        it('should not initialize wrapper emulator when configuration flag is false', () => {
            service.onFeatureInit();

            expect(wrapperEmulatorServiceMock.initialize).not.toHaveBeenCalled();
        });

        it('should initizalize emulator when configuration flag is true', () => {
            nativeAppSettingsConfigMock.enableWrapperEmulator = true;

            service.onFeatureInit();

            expect(wrapperEmulatorServiceMock.initialize).toHaveBeenCalled();
        });

        describe('events', () => {
            beforeEach(() => {
                nativeAppSettingsConfigMock.enableWrapperEmulator = true;

                service.onFeatureInit();
            });

            const WrapperSettingsKey = 'wrapper_emulator.settings';

            describe(NativeEventType.GET_APPLICATION_SETTINGS, () => {
                it('should respond with SET event with parameters from local storage', () => {
                    const settings = <WrapperSettings>{ deviceTouchSupported: true };
                    localStoreServiceMock.get.withArgs(WrapperSettingsKey).and.returnValue(settings);

                    wrapperEmulatorServiceMock.eventsToNative.next({
                        eventName: NativeEventType.GET_APPLICATION_SETTINGS,
                    });

                    expect(wrapperEmulatorServiceMock.emulateMessageToWeb).toHaveBeenCalledWith({
                        eventName: NativeEventType.SET_APPLICATION_SETTINGS,
                        parameters: settings,
                    });
                });

                it('should return default settings if not found in local storage and initilize local storage', () => {
                    const settings = <WrapperSettings>{
                        deviceTouchSupported: true,
                    };

                    wrapperEmulatorServiceMock.eventsToNative.next({
                        eventName: NativeEventType.GET_APPLICATION_SETTINGS,
                    });

                    expect(wrapperEmulatorServiceMock.emulateMessageToWeb).toHaveBeenCalledWith({
                        eventName: NativeEventType.SET_APPLICATION_SETTINGS,
                        parameters: settings,
                    });
                    expect(localStoreServiceMock.set).toHaveBeenCalledWith(WrapperSettingsKey, settings);
                });
            });

            describe(NativeEventType.UPDATE_APPLICATION_SETTINGS, () => {
                it('should update and store app settings in local storage', () => {
                    const settings = <WrapperSettings>{ deviceTouchSupported: true };
                    localStoreServiceMock.get.withArgs(WrapperSettingsKey).and.returnValue(settings);

                    wrapperEmulatorServiceMock.eventsToNative.next({
                        eventName: NativeEventType.UPDATE_APPLICATION_SETTINGS,
                        parameters: { sliderGamesEnabled: true },
                    });

                    settings.sliderGamesEnabled = true;

                    expect(localStoreServiceMock.set).toHaveBeenCalledWith(WrapperSettingsKey, settings);
                });

                it('should add opt in resolved flag when setting touchIDEnabled', () => {
                    const settings = <WrapperSettings>{ deviceTouchSupported: true };
                    localStoreServiceMock.get.withArgs(WrapperSettingsKey).and.returnValue(settings);

                    wrapperEmulatorServiceMock.eventsToNative.next({
                        eventName: NativeEventType.UPDATE_APPLICATION_SETTINGS,
                        parameters: { isTouchIDLoginEnabled: true },
                    });

                    settings.isTouchIDLoginEnabled = true;

                    expect(localStoreServiceMock.set).toHaveBeenCalledWith(WrapperSettingsKey, settings);
                });

                it('should add opt in resolved flag when setting autologinEnabled', () => {
                    const settings = <WrapperSettings>{ deviceTouchSupported: true };
                    localStoreServiceMock.get.withArgs(WrapperSettingsKey).and.returnValue(settings);

                    wrapperEmulatorServiceMock.eventsToNative.next({
                        eventName: NativeEventType.UPDATE_APPLICATION_SETTINGS,
                        parameters: { keepMeSignedInEnabled: true },
                    });

                    settings.keepMeSignedInEnabled = true;

                    expect(localStoreServiceMock.set).toHaveBeenCalledWith(WrapperSettingsKey, settings);
                });
            });
        });
    });

    describe('load settings', () => {
        it('should load settings and resolve promise', fakeAsync(() => {
            const spy = jasmine.createSpy();
            service.onFeatureInit().then(spy);

            expect(wrapperSettingsServiceMock.load).toHaveBeenCalled();

            expect(spy).not.toHaveBeenCalled();

            wrapperSettingsServiceMock.load.resolve();
            tick();

            expect(spy).toHaveBeenCalled();
        }));
    });
});
