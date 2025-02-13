import { TestBed } from '@angular/core/testing';

import { NativeEvent, WINDOW } from '@frontend/vanilla/core';
import { WrapperEmulatorService } from '@frontend/vanilla/features/native-app';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';

describe('WrapperEmulatorService', () => {
    let emulator: WrapperEmulatorService;
    let windowMock: WindowMock;
    let loggerMock: LoggerMock;
    let event: NativeEvent;

    beforeEach(() => {
        windowMock = new WindowMock();
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                WrapperEmulatorService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        emulator = TestBed.inject(WrapperEmulatorService);
        event = { eventName: 'event', parameters: { a: 1 } };
    });

    describe('initialize()', () => {
        it('should emulate native wrapper by intercepting events sent to native an publishing them as an observable', () => {
            const spy = jasmine.createSpy();

            emulator.initialize();

            emulator.eventsToNative.subscribe(spy);

            windowMock.messageToNative(event);

            expect(spy).toHaveBeenCalledWith(event);
            expect(loggerMock.debug).toHaveBeenCalled();
        });

        it('should expose method on window to emulate messages to web', () => {
            const spy = spyOn(emulator, 'emulateMessageToWeb').and.stub();

            emulator.initialize();

            windowMock.messageToWeb(event);

            expect(spy).toHaveBeenCalledWith(event);
        });
    });

    describe('emulateMessageToWeb()', () => {
        it('should trigger an event as though it was sent from wrapper to web', () => {
            emulator.initialize();

            emulator.emulateMessageToWeb(event);

            expect(windowMock.vanillaApp.native.messageToWeb).toHaveBeenCalledWith(event);
        });
    });
});
