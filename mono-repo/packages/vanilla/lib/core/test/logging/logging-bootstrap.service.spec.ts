import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { LoggingBootstrapService } from '../../src/logging/logging-bootstrap.service';
import { RemoteLogger } from '../../src/logging/remote-logger';
import { defaultRemoteLogger } from '../../src/logging/remote-logger';
import { PageMock } from '../browsercommon/page.mock';

describe('LoggingBootstrapService', () => {
    let service: LoggingBootstrapService;
    let pageMock: PageMock;
    let windowMock: WindowMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                LoggingBootstrapService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(LoggingBootstrapService);
        pageMock.logging = {
            isEnabled: true,
            debounceInterval: 10,
            maxErrorsPerBatch: 23,
            disableLogLevels: {
                error: null,
                warn: {
                    pattern: 'test pattern',
                    options: 'i',
                },
            },
        };
    });

    describe('onAppInit()', () => {
        it('should call configration', () => {
            const confguratonSpy = spyOn(RemoteLogger, 'configure');
            service.onAppInit();

            expect(confguratonSpy).toHaveBeenCalledWith({
                isEnabled: true,
                url: '/log',
                debounceInterval: 10,
                maxErrorsPerBatch: 23,
                disableLogLevels: { error: null, warn: /test pattern/ },
            });
        });

        it('befor unload', () => {
            service.onAppInit();

            const spy = spyOn(defaultRemoteLogger, 'sendLogsWithBeacon');
            windowMock.addEventListener.calls
                .all()
                .filter((c) => c.args[0] === 'beforeunload')[0]!
                .args[1]();

            expect(spy).toHaveBeenCalled();
        });
    });
});
