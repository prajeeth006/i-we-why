import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { TerminalSessionService } from '../src/terminal-session.service';

describe('TerminalSessionService', () => {
    let service: TerminalSessionService;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, TerminalSessionService],
        });

        service = TestBed.inject(TerminalSessionService);
    });

    describe('cumulativeBalance', () => {
        it('should call the API endpoint', () => {
            service.terminalSession.subscribe();

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('retail/terminalsession');
        });
    });
});
