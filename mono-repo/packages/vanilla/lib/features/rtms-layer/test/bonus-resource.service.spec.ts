import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { BonusResourceService } from '../src/bonus-resource.service';

describe('BonusResourceService', () => {
    let service: BonusResourceService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BonusResourceService],
        });

        service = TestBed.inject(BonusResourceService);
    });

    it('updateBonusTncAcceptance', () => {
        const spy = jasmine.createSpy();

        service
            .updateBonusTncAcceptance({
                offerId: 21,
                offerArc: 1,
                isCampaignBonus: true,
                tncAcceptanceFlag: true,
            })
            .subscribe(spy); // act

        apiServiceMock.post.completeWith({ updated: true });

        expect(spy).toHaveBeenCalledWith(true);
        expect(apiServiceMock.post).toHaveBeenCalledWith('bonus/updatebonustncacceptance', {
            offerId: 21,
            offerArc: 1,
            isCampaignBonus: true,
            tncAcceptanceFlag: true,
        });
    });

    it('dropBonusOffer', () => {
        const spy = jasmine.createSpy();

        service.dropBonusOffer({ bonusId: '21', agentName: 'system', reason: 'reason' }).subscribe(spy); // act

        apiServiceMock.post.completeWith({ dropped: true });

        expect(spy).toHaveBeenCalledWith(true);
        expect(apiServiceMock.post).toHaveBeenCalledWith('bonus/dropbonusoffer', { bonusId: '21', agentName: 'system', reason: 'reason' });
    });
});
