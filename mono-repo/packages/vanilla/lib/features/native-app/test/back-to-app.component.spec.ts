import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageLifetime, MessageScope, MessageType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { BackToAppComponent } from '../src/back-to-app.component';

describe('BackToAppComponent', () => {
    let fixture: ComponentFixture<BackToAppComponent>;
    let component: BackToAppComponent;
    let navigationService: NavigationServiceMock;
    let messageQueue: MessageQueueServiceMock;

    beforeEach(() => {
        navigationService = MockContext.useMock(NavigationServiceMock);
        messageQueue = MockContext.useMock(MessageQueueServiceMock);
        MockContext.useMock(CommonMessagesMock);
        TestBed.configureTestingModule({
            imports: [CommonModule],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [MockContext.providers],
        });
    });

    function initComponent() {
        TestBed.overrideComponent(BackToAppComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(BackToAppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should continueToApp', () => {
        messageQueue.count.and.returnValue(0);
        initComponent();

        expect(component.wait()).toBeTrue();
        expect(messageQueue.clear).toHaveBeenCalledWith({ clearPersistent: true });
        expect(navigationService.goToNativeApp).toHaveBeenCalledWith({ replace: true });
    });

    it('should not continueToApp', () => {
        messageQueue.count.and.returnValue(1);
        messageQueue.messages.set([
            {
                html: 'message queued.',
                type: MessageType.Success,
                lifetime: MessageLifetime.Single,
                scope: MessageScope.Login,
            },
        ]);

        initComponent();

        expect(component.wait()).toBeFalse();
    });

    it('should clone messages', () => {
        messageQueue.count.and.returnValue(1);
        messageQueue.messages.set([
            {
                html: 'message queued.',
                type: MessageType.Success,
                lifetime: MessageLifetime.Single,
                scope: MessageScope.Login,
            },
        ]);

        initComponent();

        expect(messageQueue.addMultiple).toHaveBeenCalledWith([
            {
                html: 'message queued.',
                type: MessageType.Success,
                lifetime: MessageLifetime.Single,
                scope: 'backtoapp',
            },
        ]);
    });
});
