import { TestBed } from '@angular/core/testing';

import { UserEvent, UserLogoutEvent, UserSessionExpiredEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslServiceMock } from '../../../../core/test/dsl/dsl.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { AccountMenuDataServiceMock } from '../../../account-menu/test/account-menu-data.mock';
import { CookieDBServiceMock } from '../../../hint/test/cookie-db.mock';
import { ProfilePageNudgesService } from '../../src/profile-page/profile-page-nudges.service';

describe('ProfilePageNudgesService', () => {
    let service: ProfilePageNudgesService;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let dslServiceMock: DslServiceMock;
    let userServiceMock: UserServiceMock;
    let cookieDBServiceMock: CookieDBServiceMock;

    beforeEach(() => {
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        cookieDBServiceMock = MockContext.useMock(CookieDBServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProfilePageNudgesService],
        });

        accountMenuDataServiceMock.getItem.and.returnValue({ name: 'test', children: [] });
        service = TestBed.inject(ProfilePageNudgesService);
    });

    it('should setup items with hiding', () => {
        expect(dslServiceMock.evaluateContent).toHaveBeenCalledWith([]);

        const spy = jasmine.createSpy();
        service.displayItems.subscribe(spy);

        const items = [<any>{ name: 'item1' }, <any>{ name: 'item2' }];
        dslServiceMock.evaluateContent.completeWith(items);

        expect(spy).toHaveBeenCalledWith(items);

        service.hide(items[0]);

        expect(spy).toHaveBeenCalledWith([items[1]]);
    });

    describe('should clear cookies', () => {
        runTest('Seconds', new UserLogoutEvent());
        runTest('Seconds', new UserSessionExpiredEvent());

        function runTest(eventName: string, event: UserEvent) {
            it(`when ${eventName} triggerd`, () => {
                const cookieList = cookieDBServiceMock.createList();
                const spy = spyOn(cookieList, 'deleteAll');

                userServiceMock.triggerEvent(event);

                expect(spy).toHaveBeenCalled();
            });
        }
    });
});
