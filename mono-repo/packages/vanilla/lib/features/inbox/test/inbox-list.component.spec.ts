import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { InboxListComponent } from '../src/components/inbox-list.component';
import { InboxMessageActionType } from '../src/inbox.models';
import { InboxMessage } from '../src/services/inbox.models';

describe('InboxListComponent', () => {
    let fixture: ComponentFixture<InboxListComponent>;
    let component: InboxListComponent;

    beforeEach(() => {
        TestBed.overrideComponent(InboxListComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
                imports: [TrustAsHtmlPipe],
            },
        });

        fixture = TestBed.createComponent(InboxListComponent);
        component = fixture.componentInstance;
    });

    function getMessagesMock(): InboxMessage[] {
        const msg1 = new InboxMessage();
        msg1.selected = false;
        msg1.id = '1';
        const msg2 = new InboxMessage();
        msg2.selected = true;
        msg2.id = '2';
        const msg3 = new InboxMessage();
        msg3.selected = true;
        msg3.id = '3';
        return [msg1, msg2, msg3];
    }

    describe('ngOnChanges', () => {
        it('should update messagesDisplayed on changes', () => {
            component.messages = getMessagesMock();
            component.ngOnChanges({
                messages: new SimpleChange(null, component.messages, true),
            });

            expect(component.messagesDisplayed).toEqual(component.messages);
        });
    });

    describe('selectMessage', () => {
        it('should call action.emit with InboxMessageActionTypes.messageSelected on selectMessage', () => {
            spyOn(component.action, 'emit');

            component.selectMessage();

            expect(component.action.emit).toHaveBeenCalledWith({ type: InboxMessageActionType.MessageSelected });
        });
    });

    describe('open', () => {
        it('should call action.emit with InboxMessageActionTypes.messageClicked on open', () => {
            spyOn(component.action, 'emit');
            const message = new InboxMessage();

            component.open(message);

            expect(component.action.emit).toHaveBeenCalledWith({ type: InboxMessageActionType.MessageClicked, value: message });
        });
    });
});
