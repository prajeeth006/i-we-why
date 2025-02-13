import { TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { EdsGroupService } from '@frontend/vanilla/shared/eds-group';
import { MockContext } from 'moxxi';

import { EdsGroupResourceServiceMock } from './eds-group.mocks';

describe('EdsGroupService', () => {
    let service: EdsGroupService;
    let edsGroupResourceServiceMock: EdsGroupResourceServiceMock;

    beforeEach(() => {
        edsGroupResourceServiceMock = MockContext.useMock(EdsGroupResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, EdsGroupService],
        });

        service = TestBed.inject(EdsGroupService);
    });

    it('updateCampaignStatus', fakeAsync(() => {
        service.updateCampaignStatus('123', '222'); // act
        tick();
        edsGroupResourceServiceMock.updateCampaignOptinStatus.completeWith({ status: 'OPTED_IN' });
        tick();

        expect(edsGroupResourceServiceMock.updateCampaignOptinStatus).toHaveBeenCalledWith('222', true);
        discardPeriodicTasks();
    }));

    it('getCampaignStatus', fakeAsync(() => {
        service.refreshEdsGroupStatus.next('123');
        tick(300);
        edsGroupResourceServiceMock.getGroupOptinStatus.next({
            campaignDetails: [
                {
                    id: 123,
                    optInStatus: 'OPTED_IN',
                },
            ],
        });
        tick();
        const status = service.getCampaignStatus('123'); // act

        expect(status).toBe('OPTED_IN');
    }));
});
