import { TestBed } from '@angular/core/testing';

import { MenuCounters, MenuSection } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { InboxMenuCountersProvider } from '../src/inbox-menu-counters-provider';
import { InboxServiceMock } from './inbox.mock';

describe('InboxMenuCountersProvider', () => {
    let provider: InboxMenuCountersProvider;
    let inboxServiceMock: InboxServiceMock;
    let counters: MenuCounters;

    beforeEach(() => {
        inboxServiceMock = MockContext.useMock(InboxServiceMock);

        TestBed.configureTestingModule({
            providers: [InboxMenuCountersProvider, MockContext.providers],
        });

        provider = TestBed.inject(InboxMenuCountersProvider);
        counters = new MenuCounters();
    });

    it('should set counters', () => {
        inboxServiceMock.getCount.and.returnValue(5);

        provider.setCounters(counters);

        verifyCounters(counters, 5);
    });

    it('should set counters to null if count is 0', () => {
        inboxServiceMock.getCount.and.returnValue(0);

        provider.setCounters(counters);

        verifyCounters(counters, null);
    });

    function verifyCounters(counters: MenuCounters, count: any) {
        expect(counters.sections.get(MenuSection.Menu)!.get('myinbox')).toEqual({
            count: count,
            cssClass: undefined,
            type: undefined,
        });
        expect(counters.sections.get(MenuSection.Header)!.get('inbox')).toEqual({
            count: count,
            cssClass: undefined,
            type: undefined,
        });
    }
});
