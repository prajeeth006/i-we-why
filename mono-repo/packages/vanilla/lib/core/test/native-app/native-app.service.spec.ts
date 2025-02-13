import { TestBed } from '@angular/core/testing';

import { NativeAppService, NativeEvent, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { UtilsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { LoggerMock } from '../languages/logger.mock';
import { NativeAppConfigMock } from './native-app.mock';

describe('NativeAppService', () => {
    let service: NativeAppService;
    let nativeAppConfig: NativeAppConfigMock;
    let windowMock: WindowMock;
    let utilsServiceMock: UtilsServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        nativeAppConfig = MockContext.useMock(NativeAppConfigMock);
        windowMock = new WindowMock();
        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                NativeAppService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(NativeAppService);

        windowMock.parent = new WindowMock();
        nativeAppConfig.disabledEvents = [];
        nativeAppConfig.enableCCBTracing = true;
    });

    it('should return config properties', () => {
        nativeAppConfig.isNative = true;
        nativeAppConfig.isNativeApp = true;
        nativeAppConfig.isNativeWrapper = false;
        nativeAppConfig.isDownloadClient = true;
        nativeAppConfig.isDownloadClientApp = true;
        nativeAppConfig.isDownloadClientWrapper = true;
        nativeAppConfig.isTerminal = false;
        nativeAppConfig.product = 'CASINO';
        nativeAppConfig.applicationName = 'app';
        nativeAppConfig.htcmdSchemeEnabled = true;

        expect(service.isNative).toBeTrue();
        expect(service.isNativeApp).toBeTrue();
        expect(service.isNativeWrapper).toBeFalse();
        expect(service.isNativeWrapperODR).toBeFalse();
        expect(service.isTerminal).toBeFalse();
        expect(service.isDownloadClient).toBeTrue();
        expect(service.isDownloadClientApp).toBeTrue();
        expect(service.isDownloadClientWrapper).toBeTrue();
        expect(service.product).toBe('CASINO');
        expect(service.applicationName).toBe('app');
        expect(service.htcmdSchemeEnabled).toBeTrue;
        expect(service.playtechNativeScheme).toBe('htcmd:');
    });

    it('should return default context', () => {
        expect(service.context).toBe('default');
    });

    it('should return iframe context', () => {
        (windowMock as any).top = new WindowMock();
        expect(service.context).toBe('iframe');
    });

    it('should return default native scheme', () => {
        expect(service.nativeScheme).toBe('bwin://');
    });

    describe('eventsFromNative', () => {
        it('should notify subscribers when event from native app is received', () => {
            const spy = jasmine.createSpy('spy');
            service.eventsFromNative.subscribe(spy);

            const event = { eventName: 'test' };

            service.onReceivedEventFromNative(event);

            expect(spy).toHaveBeenCalledWith(event);
            expect(loggerMock.infoRemote).toHaveBeenCalledWith('Received CCB: {"eventName":"test"}');
        });

        it('should support strigified JSON strings', () => {
            const spy = jasmine.createSpy('spy');
            service.eventsFromNative.subscribe(spy);

            const event = '{ "eventName": "test", "parameters": { "a": 1 } }';

            service.onReceivedEventFromNative(event);

            expect(spy).toHaveBeenCalledWith({ eventName: 'test', parameters: { a: 1 } });
            expect(loggerMock.infoRemote).toHaveBeenCalledWith('Received CCB: {"eventName":"test","parameters":{"a":1}}');
        });
    });

    describe('sendToNative()', () => {
        let postMessageSpy: jasmine.Spy;
        let vcPostMessageSpy: jasmine.Spy;
        let event: NativeEvent;

        beforeEach(() => {
            postMessageSpy = jasmine.createSpy('postMessage');
            vcPostMessageSpy = jasmine.createSpy('vcPostMessage');

            nativeAppConfig.isNative = true;
            event = { eventName: 'test', parameters: { inside: 'true' } };
            windowMock['messageToNative'] = postMessageSpy;
            windowMock['external'] = { NativeDispatch: vcPostMessageSpy };
            utilsServiceMock.generateGuid.and.returnValue('3e79a753-2943-4830-bad8-54ce88ce48e4');
        });

        it('should post specified event message to native app', () => {
            service.sendToNative(event);

            const eventWithId = { ...event, id: '3e79a753-2943-4830-bad8-54ce88ce48e4' };

            expect(postMessageSpy).toHaveBeenCalledWith(eventWithId);
            expect(loggerMock.infoRemote).toHaveBeenCalledWith(
                'Sending CCB via messageToNative: {"eventName":"test","parameters":{"inside":"true"},"id":"3e79a753-2943-4830-bad8-54ce88ce48e4"}',
            );
        });

        it('should post specified event message to external NativeDispatch method', () => {
            windowMock['messageToNative'] = <any>null;
            event.parameters = { param1: 'val' };

            service.sendToNative(event);

            expect(vcPostMessageSpy).toHaveBeenCalledWith('test', '{"param1":"val"}');
            expect(loggerMock.infoRemote).toHaveBeenCalledWith(
                'Sending CCB via external.NativeDispatch: {"eventName":"test","parameters":{"param1":"val"},"id":"3e79a753-2943-4830-bad8-54ce88ce48e4"}',
            );
        });

        it('should sanitize password param', () => {
            event.parameters = { passwordLost: '123123' };
            service.sendToNative(event);

            const eventWithId = { ...event, id: '3e79a753-2943-4830-bad8-54ce88ce48e4' };

            expect(postMessageSpy).toHaveBeenCalledWith(eventWithId);
            expect(loggerMock.infoRemote).toHaveBeenCalledWith(
                'Sending CCB via messageToNative: {"eventName":"test","parameters":{"passwordLost":"***"},"id":"3e79a753-2943-4830-bad8-54ce88ce48e4"}',
            );
        });

        it('should not log event remotely', () => {
            nativeAppConfig.enableCCBTracing = false;
            service.sendToNative(event);

            const eventWithId = { ...event, id: '3e79a753-2943-4830-bad8-54ce88ce48e4' };

            expect(postMessageSpy).toHaveBeenCalledWith(eventWithId);
            expect(loggerMock.infoRemote).not.toHaveBeenCalled();
        });

        it('should not sent event', () => {
            nativeAppConfig.disabledEvents = ['test'];
            service.sendToNative(event);

            expect(postMessageSpy).toHaveBeenCalledTimes(0);
            expect(vcPostMessageSpy).toHaveBeenCalledTimes(0);
            expect(loggerMock.infoRemote).toHaveBeenCalledTimes(0);
        });
    });

    describe('should not log event remotely ', () => {
        beforeEach(() => {
            nativeAppConfig.tracingBlacklistPattern = 'features_loaded';
            service = TestBed.inject(NativeAppService);
        });

        it('when blacklist pattern is met', () => {
            const event = { eventName: 'features_loaded', id: '3e79a753-2943-4830-bad8-54ce88ce48e4' };
            service.sendToNative(event);

            expect(loggerMock.infoRemote).not.toHaveBeenCalled();
        });
    });
});
