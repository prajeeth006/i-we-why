import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { AccountMenuTasksServiceMock } from '../../../account-menu/test/account-menu-data.mock';
import { InboxCoreServiceMock } from '../../../inbox/test/inbox.mock';
import { InboxCardComponent } from '../../src/profile-page/inbox-card.component';

describe('InboxCardComponent', () => {
    let fixture: ComponentFixture<InboxCardComponent>;
    let component: InboxCardComponent;
    let inboxServiceMock: InboxCoreServiceMock;

    beforeEach(() => {
        inboxServiceMock = MockContext.useMock(InboxCoreServiceMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(AccountMenuTasksServiceMock);

        TestBed.overrideComponent(InboxCardComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(InboxCardComponent);
        component = fixture.componentInstance;
        component.item = <any>{ name: 'item', resources: { Text: 'you have _COUNT_ new messages.' } };
    });

    it('should init successfully', () => {
        fixture.detectChanges();
        inboxServiceMock.whenReady.next();
        inboxServiceMock.count.next(5);
        expect(component.inboxMessagesText).toBe('you have 5 new messages.');
    });
});
