import { TestBed } from '@angular/core/testing';

import { OffersResourceService } from '@frontend/vanilla/shared/offers';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';

describe('OffersResourceService', () => {
    let service: OffersResourceService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OffersResourceService],
        });

        service = TestBed.inject(OffersResourceService);
    });

    it('getCount', () => {
        const spy = jasmine.createSpy();

        service.getCount().subscribe(spy); // act

        apiServiceMock.get.completeWith({ count: 5 });

        expect(spy).toHaveBeenCalledWith({ count: 5 });
        expect(apiServiceMock.get).toHaveBeenCalledWith('offers/count');
    });

    it('getStatus', () => {
        const spy = jasmine.createSpy();

        service.getStatus('eds', '123').subscribe(spy); // act

        apiServiceMock.get.completeWith(<any>{ status: 'optedin' });

        expect(spy).toHaveBeenCalledWith({ status: 'optedin' });
        expect(apiServiceMock.get).toHaveBeenCalledWith('offers/eds/123');
    });

    it('updateStatus', () => {
        const spy = jasmine.createSpy();

        service.updateStatus('eds', '123', true).subscribe(spy); // act

        apiServiceMock.post.completeWith(<any>{ status: 'optedin' });

        expect(spy).toHaveBeenCalledWith({ status: 'optedin' });
        expect(apiServiceMock.post).toHaveBeenCalledWith('offers/eds/123/true');
    });
});
