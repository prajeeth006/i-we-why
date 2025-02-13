import { TestBed } from '@angular/core/testing';

import { CookieDBService } from '@frontend/vanilla/core';
import { AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { TopLevelCookiesConfigMock } from '../../../core/test/browser/cookie.mock';
import { AccountMenuDataServiceMock } from './account-menu-data.mock';

describe('AccountMenuTasksService', () => {
    let service: AccountMenuTasksService;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    const allItems = [<any>{ name: 'item1', parameters: {} }, <any>{ name: 'item2', parameters: {} }, <any>{ name: 'item3', parameters: {} }];
    let spy: jasmine.Spy;

    beforeEach(() => {
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(TopLevelCookiesConfigMock);

        TestBed.configureTestingModule({
            providers: [CookieDBService, MockContext.providers, AccountMenuTasksService],
        });

        accountMenuDataServiceMock.getItem.and.returnValue({ item: 'tasks', children: allItems });
        service = TestBed.inject(AccountMenuTasksService);
        accountMenuDataServiceMock.content.next(allItems);
        spy = jasmine.createSpy();
        service.displayItems.subscribe(spy);
    });

    it('hide should work', () => {
        service.hide([]);
        expect(spy).toHaveBeenCalledWith(allItems);
    });

    it('showAllHidden should work', () => {
        const spy = jasmine.createSpy();
        service.displayItems.subscribe(spy);
        service.showAllHidden();
        expect(spy).toHaveBeenCalledWith(allItems);
    });
});
