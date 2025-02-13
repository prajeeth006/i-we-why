import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { EdsGroupResourceService } from '../src/eds-group-resource.service';

describe('EdsGroupResourceService', () => {
    let service: EdsGroupResourceService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, EdsGroupResourceService],
        });

        service = TestBed.inject(EdsGroupResourceService);
    });

    it('updateStatus', () => {
        const spy = jasmine.createSpy();

        service.updateCampaignOptinStatus('123', true).subscribe(spy); // act

        apiServiceMock.post.completeWith(<any>{ status: 'optedin' });

        expect(spy).toHaveBeenCalledWith({ status: 'optedin' });
        expect(apiServiceMock.post).toHaveBeenCalledWith('edsgroup/123/true');
    });

    it('getGroupOptinStatus', () => {
        const spy = jasmine.createSpy();

        service.getGroupOptinStatus('123').subscribe(spy); // act

        apiServiceMock.get.completeWith(<any>{ status: 'optedin' });

        expect(spy).toHaveBeenCalledWith({ status: 'optedin' });
        expect(apiServiceMock.get).toHaveBeenCalledWith('edsgroup/123');
    });
});
