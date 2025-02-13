import { TestBed } from '@angular/core/testing';

import { LocalStoreKey, STORE_PREFIX, SlotName } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { PlayerActiveWagerTimerComponent } from '../src/player-active-wager-timer.component';
import { PlayerActiveWagerService } from '../src/player-active-wager.service';

describe('PlayerActiveWagerService', () => {
    let service: PlayerActiveWagerService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let localStoreServiceMock: LocalStoreServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                PlayerActiveWagerService,
                {
                    provide: STORE_PREFIX,
                    useValue: 'van.',
                },
            ],
        });

        service = TestBed.inject(PlayerActiveWagerService);
    });

    describe('refreshWagerTimer', () => {
        it('should call the API and refresh wager timer', () => {
            const response = {
                productId: 'CASINO',
                lastWageredTimeStamp: '/Date(1684316449000)/',
                blockWager: false,
                blockWagerForSeconds: '300',
                code: 0,
                codeDescription: '11',
                firstActivatedTime: '/Date(1687247954362)/',
            };

            service.refreshWagerTimer();
            apiServiceMock.get.completeWith(response);

            expect(apiServiceMock.get).toHaveBeenCalledOnceWith('activeWagerDetails');
            expect(localStoreServiceMock.set).toHaveBeenCalledOnceWith(LocalStoreKey.LugasTimestamp, response.firstActivatedTime);
            expect(dynamicLayoutServiceMock.removeComponent).toHaveBeenCalledOnceWith(SlotName.HeaderTopItems, PlayerActiveWagerTimerComponent);
            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledOnceWith(SlotName.HeaderTopItems, PlayerActiveWagerTimerComponent, {});
        });
    });
});
