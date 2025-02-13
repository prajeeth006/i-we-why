import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { InboxCoreServiceMock as InboxServiceMock } from '../../../features/inbox/test/inbox.mock';
import { InboxIconComponent } from '../src/inbox-icon/inbox-icon.component';

describe('InboxIconComponent', () => {
    let fixture: ComponentFixture<InboxIconComponent>;
    let component: InboxIconComponent;
    let inboxServiceMock: InboxServiceMock;

    beforeEach(() => {
        MockContext.useMock(MenuActionsServiceMock);
        inboxServiceMock = MockContext.useMock(InboxServiceMock);
        MockContext.useMock(UserServiceMock);

        TestBed.overrideComponent(InboxIconComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
                imports: [],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(InboxIconComponent);
        component = fixture.componentInstance;
    }

    // TODO: test init

    describe('showInbox()', () => {
        it('should open inbox', () => {
            initComponent();
            inboxServiceMock.whenReady.next();
            component.showInbox();

            expect(inboxServiceMock.open).toHaveBeenCalledWith({ trackingEventName: 'Event.inbox.clicked_icon', showBackButton: false });
        });
    });
});
