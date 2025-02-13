import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CurrentSessionConfigMock } from '../../login-duration/test/current-session.mock';
import { ActivityPopupBootstrapService } from '../src/activity-popup-bootstrap.service';
import { ActivityPopupConfigMock, ActivityPopupServiceMock } from './activity-popup.mock';

describe('ActivityPopupBootstrapService', () => {
    let service: ActivityPopupBootstrapService;
    let activityPopupServiceMock: ActivityPopupServiceMock;
    let clientConfigServiceMock: ActivityPopupConfigMock;
    let currentSessionConfigMock: CurrentSessionConfigMock;

    beforeEach(() => {
        activityPopupServiceMock = MockContext.useMock(ActivityPopupServiceMock);
        clientConfigServiceMock = MockContext.useMock(ActivityPopupConfigMock);
        currentSessionConfigMock = MockContext.useMock(CurrentSessionConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ActivityPopupBootstrapService],
        });

        service = TestBed.inject(ActivityPopupBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should init activity popup when user logged in', fakeAsync(() => {
            service.onFeatureInit();
            clientConfigServiceMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            expect(activityPopupServiceMock.setTimer).toHaveBeenCalled();
        }));
    });
});
