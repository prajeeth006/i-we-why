import { TestBed } from '@angular/core/testing';

import { NoopTrackingService, TriggerEventPromiseResult, UrlService } from '@frontend/vanilla/core';
import { MockProvider } from 'ng-mocks';

import { TrackingConfig } from '../src/tracking.client-config';
import { TrackingConfigMock } from './mocks/tracking-config.mock';

describe('NoopTrackingService', () => {
    let service: NoopTrackingService;
    let trackingConfigMock: typeof TrackingConfigMock;

    beforeEach(() => {
        trackingConfigMock = TrackingConfigMock;
        trackingConfigMock.isEnabled = false;

        TestBed.configureTestingModule({
            providers: [UrlService, MockProvider(TrackingConfig, trackingConfigMock)],
        });

        service = TestBed.inject(NoopTrackingService);
    });

    describe('triggerEvent()', () => {
        it('should resolve promise', (done) => {
            service.triggerEvent().then((result: any) => {
                expect(result).toBe(TriggerEventPromiseResult.Normal);
                done();
            });
        });
    });
});
