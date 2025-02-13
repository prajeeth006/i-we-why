import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TimerServiceMock } from '../../../core/src/browser/timer.mock';
import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { PrerenderBootstrapService } from '../src/prerender-bootstrap.service';
import { PrerenderConfigMock } from './prerender.client-config';

describe('PrerenderBootstrapService', () => {
    let service: PrerenderBootstrapService;
    let timerServiceMock: TimerServiceMock;
    let config: PrerenderConfigMock;
    let windowMock: WindowMock;

    beforeEach(() => {
        timerServiceMock = MockContext.useMock(TimerServiceMock);
        windowMock = new WindowMock();
        config = MockContext.useMock(PrerenderConfigMock);

        TestBed.configureTestingModule({
            providers: [
                PrerenderBootstrapService,
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(PrerenderBootstrapService);
    });

    it('should start a timer', () => {
        service.onFeatureInit();
        config.whenReady.next();
        expect(timerServiceMock.setTimeout).toHaveBeenCalledTimes(1);
    });

    it('should not start a timer if prerender is already enabled.', () => {
        windowMock['prerenderReady'] = true;
        service.onFeatureInit();
        config.whenReady.next();
        expect(timerServiceMock.setTimeout).toHaveBeenCalledTimes(0);
    });
});
