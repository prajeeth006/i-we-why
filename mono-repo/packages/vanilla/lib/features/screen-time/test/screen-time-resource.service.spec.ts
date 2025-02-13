import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { ScreenTimeResourcesService } from '../src/screen-time-resource.service';

describe('ScreenTimeResourcesService', () => {
    let service: ScreenTimeResourcesService;
    let windowMock: WindowMock;

    beforeEach(() => {
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ScreenTimeResourcesService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(ScreenTimeResourcesService);
    });

    it('should call sendBeacon api', () => {
        const screenTimeRequest = {
            startTime: new Date(2012, 12, 15),
            screenTime: new Date(2012, 12, 16),
            mac: 'test',
        };
        const headers = { 'type': 'application/json', 'x-bwin-sf-api': 'qa2' };
        const blob = new Blob([JSON.stringify(screenTimeRequest)], headers);

        service.saveScreenTime(screenTimeRequest);

        expect(windowMock.navigator.sendBeacon).toHaveBeenCalledWith('/api/screentime/save', blob);
    });
});
