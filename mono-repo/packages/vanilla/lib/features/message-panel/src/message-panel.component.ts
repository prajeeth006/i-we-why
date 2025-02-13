import { CommonModule } from '@angular/common';
import { Component, EffectRef, ElementRef, Input, OnDestroy, OnInit, ViewEncapsulation, effect } from '@angular/core';

import {
    DynamicHtmlDirective,
    Message,
    MessageQueueService,
    WebWorkerService,
    WindowOffsetModifierService,
    WorkerType,
    trackByProp,
} from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { MessagePanelRegistry } from './message-panel-registry.service';
import { IMessagePanelComponent, MessagePanelRegistryEvent } from './message-panel.models';

/**
 * @whatItDoes Displays messages that have been added by {@link MessageQueueService}.
 *
 * @howToUse
 *
 * Place this component on a page where you want to display messages.
 *
 * ```
 * <vn-message-panel scope="example-scope" />
 * ```
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective],
    selector: 'vn-message-panel',
    templateUrl: 'message-panel.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/message-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class MessagePanelComponent implements IMessagePanelComponent, OnInit, OnDestroy {
    @Input() scope: string;

    messages: Message[] = [];
    isLatest: boolean;
    readonly trackByHtml = trackByProp<Message>('html');

    private unsubscribe = new Subject<void>();
    private messagesEffectRef: EffectRef;

    constructor(
        private service: MessageQueueService,
        private elementRef: ElementRef<HTMLElement>,
        private windowOffsetModifierService: WindowOffsetModifierService,
        private registry: MessagePanelRegistry,
        private webWorkerService: WebWorkerService,
    ) {
        this.messagesEffectRef = effect(() => {
            this.messages = this.service.messages().filter((message: Message) => (message.scope || '') === this.currentScope);

            if (this.messages.length) {
                const offset = this.elementRef.nativeElement.getBoundingClientRect().top;
                this.windowOffsetModifierService.scrollBy(offset);
            }
        });
    }

    get currentScope(): string {
        return this.scope || '';
    }

    ngOnInit() {
        this.registry.onChange
            .pipe(
                takeUntil(this.unsubscribe),
                filter((c: MessagePanelRegistryEvent) => c.component?.currentScope === this.currentScope),
            )
            .subscribe((c: MessagePanelRegistryEvent) => {
                const workerType = WorkerType.MessagePanelTimeout + this.currentScope;

                this.webWorkerService.createWorker(workerType, { timeout: 0 }, () => {
                    this.isLatest = c.component === this;
                    this.webWorkerService.removeWorker(workerType);
                });
            });

        this.registry.add(this);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.messagesEffectRef.destroy();
        this.registry.remove(this);
        this.webWorkerService.removeWorker(WorkerType.MessagePanelTimeout + this.currentScope);
    }
}
