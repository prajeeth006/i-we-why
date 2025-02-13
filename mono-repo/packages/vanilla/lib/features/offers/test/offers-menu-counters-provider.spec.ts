import { TestBed } from '@angular/core/testing';

import { MenuCounters, MenuSection } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OffersServiceMock } from '../../../shared/offers/test/offers.mocks';
import { OffersMenuCountersProvider } from '../src/offer-menu-counters-provider';

describe('OffersMenuCountersProvider', () => {
    let provider: OffersMenuCountersProvider;
    let offerServiceMock: OffersServiceMock;

    beforeEach(() => {
        offerServiceMock = MockContext.useMock(OffersServiceMock);

        TestBed.configureTestingModule({
            providers: [OffersMenuCountersProvider, MockContext.providers],
        });

        provider = TestBed.inject(OffersMenuCountersProvider);
    });

    it('should set counters', () => {
        offerServiceMock.getCount.withArgs('ALL').and.returnValue(5);

        const counters = new MenuCounters();
        provider.setCounters(counters);

        verifyCounters(counters, 5);
    });

    it('should set counters to null if count is 0', () => {
        offerServiceMock.getCount.withArgs('ALL').and.returnValue(0);

        const counters = new MenuCounters();
        provider.setCounters(counters);

        verifyCounters(counters, null);
    });

    function verifyCounters(counters: MenuCounters, count: any) {
        expect(counters.sections.get(MenuSection.Header)?.get('promo')).toEqual({
            count,
            cssClass: undefined,
            type: undefined,
        });
        expect(counters.sections.get(MenuSection.Menu)?.get('offers')).toEqual({
            count,
            cssClass: undefined,
            type: undefined,
        });
        expect(counters.sections.get(MenuSection.BottomNav)?.get('myoffers')).toEqual({
            count,
            cssClass: undefined,
            type: undefined,
        });
    }
});
