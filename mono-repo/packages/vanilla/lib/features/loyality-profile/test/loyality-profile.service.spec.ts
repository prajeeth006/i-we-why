import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { LoyalityProfileService } from '../src/loyality-profile.service';

describe('AbuserInformationService', () => {
    let service: LoyalityProfileService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoyalityProfileService],
        });

        service = TestBed.inject(LoyalityProfileService);
    });

    describe('load', () => {
        it('should return null value if not loaded', () => {
            const spy = jasmine.createSpy();
            service.mlifeLoyalityProfile.subscribe(spy);
            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if loaded', () => {
            const spy = jasmine.createSpy();
            service.mlifeLoyalityProfile.subscribe(spy);
            service.refresh();
            const response = {
                mlifeNo: -1,
                tier: '',
                tierDesc: '',
                tierCredits: -1,
            };

            apiServiceMock.get.completeWith(response);
            expect(spy).toHaveBeenCalledWith(response);
            expect(apiServiceMock.get).toHaveBeenCalledWith('accountmenu/mlifeprofile');
        });
    });
});
