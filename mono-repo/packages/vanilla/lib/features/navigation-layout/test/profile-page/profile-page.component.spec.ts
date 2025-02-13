import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { TopLevelCookiesConfigMock } from '../../../../core/test/browser/cookie.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { AccountMenuDataServiceMock, AccountMenuTasksServiceMock } from '../../../account-menu/test/account-menu-data.mock';
import { AccountMenuTrackingServiceMock } from '../../../account-menu/test/account-menu-tracking.mock';
import { InboxConfigMock } from '../../../inbox/test/inbox.client-config.mock';
import { ProfilePageComponent } from '../../src/profile-page/profile-page.component';

describe('ProfilePageComponent', () => {
    let fixture: ComponentFixture<ProfilePageComponent>;
    let component: ProfilePageComponent;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;

    beforeEach(() => {
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(AccountMenuTrackingServiceMock);
        MockContext.useMock(TopLevelCookiesConfigMock);
        MockContext.useMock(AccountMenuTasksServiceMock);
        MockContext.useMock(InboxConfigMock);

        TestBed.overrideComponent(ProfilePageComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(ProfilePageComponent);
        component = fixture.componentInstance;
    }

    it('should init successfully', () => {
        accountMenuDataServiceMock.getItem.and.returnValue(<any>{ name: 'test' });
        initComponent();

        expect(component.help!.name).toBe('test');
        expect(component.inbox!.name).toBe('test');
        expect(component.commonActions!.name).toBe('test');
        expect(component.content!.name).toBe('test');
    });
});
