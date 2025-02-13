import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AffordabilitySnapshotDetails } from '../src/affordability.models';
import { AffordabilityService } from '../src/affordability.service';

describe('AffordabilityService', () => {
    let service: AffordabilityService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AffordabilityService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(AffordabilityService);
    });

    describe('load', () => {
        it('should NOT call the API if unauthenticated', () => {
            userServiceMock.isAuthenticated = false;
            service.load();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        });

        it('should return mocked value if user is authenticated', () => {
            userServiceMock.isAuthenticated = true;
            const snapshotDetails: AffordabilitySnapshotDetails = {
                affordabilityStatus: 'LEVEL2',
                employmentGroup: 'OTHER',
            };
            const spy = jasmine.createSpy();
            service.snapshotDetails.subscribe(spy);
            service.load();

            apiServiceMock.post.completeWith(snapshotDetails);

            expect(spy).toHaveBeenCalledWith(snapshotDetails);
            expect(apiServiceMock.post).toHaveBeenCalledOnceWith('affordability/snapshotdetails');
            expect(trackingServiceMock.updateDataLayer).toHaveBeenCalledOnceWith({ 'user.affordabilityJourney': 'level2' });
        });

        it('should not track if affordabilityStatus is null', () => {
            userServiceMock.isAuthenticated = true;
            const snapshotDetails: AffordabilitySnapshotDetails = {
                affordabilityStatus: '',
                employmentGroup: 'OTHER',
            };
            const spy = jasmine.createSpy();
            service.snapshotDetails.subscribe(spy);
            service.load();

            apiServiceMock.post.completeWith(snapshotDetails);

            expect(spy).toHaveBeenCalledWith(snapshotDetails);
            expect(apiServiceMock.post).toHaveBeenCalledOnceWith('affordability/snapshotdetails');
            expect(trackingServiceMock.updateDataLayer).not.toHaveBeenCalled();
        });
    });
});
