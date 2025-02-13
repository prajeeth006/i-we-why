import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { NativeEventType, TimeSpan, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test';
import { TerminalSessionBootstrapService } from '../src/terminal-session-bootstrap.service';
import { TerminalSessionNotification } from '../src/terminal-session.models';
import { TerminalSessionConfigMock, TerminalSessionOverlayServiceMock, TerminalSessionServiceMock } from './terminal-session.mocks';

describe('TerminalSessionBootstrapService', () => {
    let service: TerminalSessionBootstrapService;
    let terminalSessionConfigMock: TerminalSessionConfigMock;
    let terminalSessionServiceMock: TerminalSessionServiceMock;
    let terminalSessionOverlayServiceMock: TerminalSessionOverlayServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        terminalSessionConfigMock = MockContext.useMock(TerminalSessionConfigMock);
        terminalSessionServiceMock = MockContext.useMock(TerminalSessionServiceMock);
        terminalSessionOverlayServiceMock = MockContext.useMock(TerminalSessionOverlayServiceMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, TerminalSessionBootstrapService],
        });

        service = TestBed.inject(TerminalSessionBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should create Web worker when balance changes from 0 to a positive number', fakeAsync(() => {
            service.onFeatureInit();
            terminalSessionConfigMock.depositAlertTime = TimeSpan.fromSeconds(10).totalMilliseconds;
            terminalSessionConfigMock.whenReady.next();
            tick();

            balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 0 });
            balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 100 });
            tick();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.TerminalSessionTimeout,
                { timeout: terminalSessionConfigMock.depositAlertTime },
                jasmine.any(Function),
            );

            flush();
        }));

        it('should show overlay after configured Web worker timeout', fakeAsync(() => {
            service.onFeatureInit();
            terminalSessionConfigMock.depositAlertTime = TimeSpan.fromSeconds(10).totalMilliseconds;
            terminalSessionConfigMock.whenReady.next();
            tick();

            balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 0 });
            balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 100 });
            webWorkerServiceMock.removeWorker.withArgs(WorkerType.TerminalSessionTimeout).and.returnValue(10);
            tick(10000);

            terminalSessionServiceMock.terminalSession.next(<any>{ cumulativeBalance: 100 });
            tick();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.TerminalSessionTimeout);

            const terminalSessionNotification: TerminalSessionNotification = { cumulativeBalance: 100, timeActive: TimeSpan.fromSeconds(10) };

            expect(terminalSessionOverlayServiceMock.show).toHaveBeenCalledOnceWith(terminalSessionNotification);
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({
                eventName: NativeEventType.SESSION_ALERT,
                parameters: terminalSessionNotification,
            });
        }));

        it('should remove Web worker when balance changes from a positive number to 0', fakeAsync(() => {
            service.onFeatureInit();
            terminalSessionConfigMock.depositAlertTime = TimeSpan.fromSeconds(10).totalMilliseconds;
            terminalSessionConfigMock.whenReady.next();
            tick();

            balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 100 });
            balancePropertiesServiceMock.balanceProperties.next(<any>{ accountBalance: 0 });
            tick();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.TerminalSessionTimeout);
        }));
    });
});
