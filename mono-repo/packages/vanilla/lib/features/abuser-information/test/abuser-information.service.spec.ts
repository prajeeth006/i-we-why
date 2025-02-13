import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { AbuserInformationService } from '../src/abuser-information.service';

describe('AbuserInformationService', () => {
    let service: AbuserInformationService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AbuserInformationService],
        });

        service = TestBed.inject(AbuserInformationService);
    });

    describe('load', () => {
        it('should return null value if not loaded', () => {
            const spy = jasmine.createSpy();

            service.abuserInformation.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should return mocked value if loaded', () => {
            const spy = jasmine.createSpy();

            service.abuserInformation.subscribe(spy);
            service.load();

            const response = {
                valueSegmentId: 1,
                sportsBettingFactor: 2.34,
                isBonusAbuser: true,
            };

            apiServiceMock.get.completeWith(response);

            expect(spy).toHaveBeenCalledWith(response);
            expect(apiServiceMock.get).toHaveBeenCalledWith('abuserinformation');
        });
    });
});
