import { Injectable, inject, signal } from '@angular/core';

import { SessionStoreKey } from '../browser/browser.models';
import { SessionStoreService } from '../browser/store/session-store.service';
import { WINDOW } from '../browser/window/window.token';
import { Message, MessageLifetime, MessageQueueClearOptions, MessageType } from './message.models';

/**
 * @whatItDoes Stores messages displayed by `MessagePanelComponent`, and allows managing them (adding, removing, clearing)
 *
 * @howToUse
 *
 * ```
 * this.messageQueueService.add('msg', 'Error', 'Single'); // add an arbitrary message
 *
 * // useful shortcuts for adding messages (lifetime defaults to Single)
 * this.messageQueueService.addError('msg');
 * this.messageQueueService.addInfo('msg');
 * this.messageQueueService.addSuccess('msg');
 *
 * // remove a message
 * const message = this.messageQueueService.addError('msg');
 * this.messageQueueService.remove(message);
 *
 * // remove by predicate
 * this.messageQueueService.remove(m => m.type === 'Error')
 * ```
 *
 * @description
 *
 * Messages ({@link Message}) have following properties:
 *  - **html**: The text to display (can be html string)
 *  - **type** ({@link MessageType}): Style of the message (Error, Success and Information are supported by themes)
 *  - **lifetime** ({@link MessageLifetime}): How long the message stays on the screen (Single disappears after 1 location change, TempData after 2 location changes)
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class MessageQueueService {
    readonly messages = signal<Message[]>([]);

    private sessionStoreService = inject(SessionStoreService);
    readonly #window = inject(WINDOW);

    private messageList: Message[] = [];

    add(
        newMessage: Message | string,
        type: MessageType = MessageType.Default,
        lifetime: MessageLifetime = MessageLifetime.Single,
        scope: string = '',
    ): Message {
        if (newMessage === null) {
            throw new Error('Attempt to add an empty message');
        }

        let finalMessage: Message;

        if (typeof newMessage === 'object') {
            finalMessage = newMessage;
        } else {
            finalMessage = { html: newMessage, type, lifetime, scope };
        }

        finalMessage.scope = finalMessage.scope || '';

        this.messages.update(() => [...this.messageList, finalMessage]);
        this.messageList.push(finalMessage);

        return finalMessage;
    }

    addError(message: string, lifetime: MessageLifetime = MessageLifetime.Single, scope = ''): Message {
        return this.add(message, MessageType.Error, lifetime, scope);
    }

    addInfo(message: string, lifetime: MessageLifetime = MessageLifetime.Single, scope = ''): Message {
        return this.add(message, MessageType.Information, lifetime, scope);
    }

    addSuccess(message: string, lifetime: MessageLifetime = MessageLifetime.Single, scope = ''): Message {
        return this.add(message, MessageType.Success, lifetime, scope);
    }

    addMultiple(newMessages: Message[]) {
        if (!newMessages || !Array.isArray(newMessages)) {
            throw new Error('Attempt to add an multiple messages - input is invalid (undefined or not an array)');
        }

        newMessages.forEach((message: Message) => this.add(message));
    }

    count(scope?: string): number {
        return scope === undefined ? this.messageList.length : this.messageList.filter((m: Message) => m.scope === scope).length;
    }

    remove(message: Message | ((m: Message) => boolean)) {
        if (typeof message === 'function') {
            this.messageList = this.messageList.filter((m: Message) => !message(m));
        } else {
            const index = this.messageList.indexOf(message);
            this.messageList.splice(index, 1);
        }

        this.messages.set(this.messageList);
    }

    clear(options?: MessageQueueClearOptions) {
        if (options?.clearPersistent) {
            if (options?.scope === undefined) {
                const urlParams = new URLSearchParams(this.#window.location.search);
                const messageType = urlParams.get('type');
                this.remove((message: Message) => message.name !== messageType);
            } else {
                this.remove((message: Message) => message.scope === (options?.scope || ''));
            }
        } else {
            this.messageList = this.messageList.filter((message: Message) => message.lifetime !== MessageLifetime.Single);
            this.touchTempData(options?.scope);
        }

        if (options?.clearStoredMessages) {
            this.sessionStoreService.remove(SessionStoreKey.MessageQueue);
        }

        this.messages.set(this.messageList);
    }

    changeScope(currentScope: string, newScope: string) {
        this.messageList.filter((message: Message) => message.scope === currentScope).forEach((message: Message) => (message.scope = newScope));
        this.messages.set(this.messageList);
    }

    /**
     * @internal
     */
    storeMessages(scope?: string) {
        this.touchTempData(scope);
        this.sessionStoreService.set(SessionStoreKey.MessageQueue, this.messageList);
    }

    /**
     * @internal
     */
    restoreMessages() {
        this.clear({ clearPersistent: true });

        const messagesFromStore = this.sessionStoreService.get(SessionStoreKey.MessageQueue) as Message[];

        if (messagesFromStore) {
            this.addMultiple(messagesFromStore);

            this.sessionStoreService.remove(SessionStoreKey.MessageQueue);
        }
    }

    private touchTempData(scope?: string) {
        const messages = scope === undefined ? this.messageList : this.messageList.filter((m: Message) => m.scope === (scope || ''));

        messages.forEach((m: Message) => {
            if (m.lifetime === MessageLifetime.TempData) {
                m.lifetime = MessageLifetime.Single;
            }
        });

        this.messages.set(this.messageList);
    }
}
