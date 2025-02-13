import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MessageLifetime, MessageType, WorkerType } from '@frontend/vanilla/core';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';
import { MockContext } from 'moxxi';

import { WindowOffsetModifierServiceMock } from '../../../core/test/browser/window-offset-modifier.service.mock';
import { ElementRefMock } from '../../../core/test/element-ref.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { MessagePanelRegistryMock } from './message-panel-registry.mock';

describe('MessagePanelComponent', () => {
    let fixture: ComponentFixture<MessagePanelComponent>;
    let component: MessagePanelComponent;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let messagePanelRegistryMock: MessagePanelRegistryMock;
    let elementRefMock: ElementRefMock;
    let windowOffsetModifierServiceMock: WindowOffsetModifierServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        messagePanelRegistryMock = MockContext.useMock(MessagePanelRegistryMock);
        elementRefMock = MockContext.useMock(ElementRefMock);
        windowOffsetModifierServiceMock = MockContext.useMock(WindowOffsetModifierServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.overrideComponent(MessagePanelComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        elementRefMock.nativeElement.getBoundingClientRect.and.returnValue({ top: -20 });

        fixture = TestBed.createComponent(MessagePanelComponent);
        component = fixture.componentInstance;
        (component as any).elementRef = elementRefMock;
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should display messages', fakeAsync(() => {
            expect(component.isLatest).toBeUndefined();

            messagePanelRegistryMock.onChange.next({ component });
            messageQueueServiceMock.messages.set([{ html: 'test', type: MessageType.Error, lifetime: MessageLifetime.Single }]);

            tick();
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('.message-panel > div')).length).toBe(1);

            const workerType = WorkerType.MessagePanelTimeout + component.currentScope;

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(workerType, { timeout: 0 }, jasmine.any(Function));
            expect(component.isLatest).toBeTrue();
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(workerType);
            expect(messagePanelRegistryMock.add).toHaveBeenCalledOnceWith(component);
        }));

        it('should only display messages with matching scope', fakeAsync(() => {
            component.scope = 'myScope';
            messagePanelRegistryMock.onChange.next({ component });
            messageQueueServiceMock.messages.set([
                { html: 'test', type: MessageType.Error, lifetime: MessageLifetime.Single },
                { html: 'test', type: MessageType.Error, lifetime: MessageLifetime.Single, scope: 'myScope' },
            ]);

            tick();
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('.message-panel > div')).length).toBe(1);
        }));

        it('should call scrollBy with top value', () => {
            messageQueueServiceMock.messages.set([{ html: 'test', type: MessageType.Error, lifetime: MessageLifetime.Single }]);

            fixture.detectChanges();

            expect(windowOffsetModifierServiceMock.scrollBy).toHaveBeenCalledOnceWith(-20);
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove the worker and component from message panel registry', () => {
            fixture.destroy();

            expect(messagePanelRegistryMock.remove).toHaveBeenCalledOnceWith(component);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.MessagePanelTimeout + component.currentScope);
        });
    });
});
