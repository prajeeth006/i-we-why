import { Injectable, inject } from '@angular/core';

import { ConnectionState, Service } from '@rtms/client';
import { NotificationParams } from '@rtms/client/lib/protocol';
import { NEVER, Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

import { WINDOW } from '../browser/window/window.token';
import { DslService } from '../dsl/dsl.service';
import { UserEvent, UserLoginEvent } from '../user/user-events';
import { UserService } from '../user/user.service';
import { vanillaAppExport } from '../utils/vanilla-app-export';
import { RtmsMessage } from './rtms-message';
import { RtmsServiceFactory } from './rtms-service.factory';
import { RtmsConfig } from './rtms.client-config';

/**
 * @whatItDoes Allows subscribing to messages from Real-Time Messaging System implemented by the platform.
 *
 * @howToUse
 * ```
 * let sub = this.rtmsService.messages
 *     .filter(m => m.type === 'PLAYERINBOX_UPDATE')
 *     .subscribe(m => {
 *         this.messageCount = m.payload.newMsgCount;
 *     });
 * ```
 *
 * @description
 *
 * Delegates to `@rtms/client`.
 * Automatically reconnects on the user login.
 * Automatically reconnects on focusing browser tab if logged out.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RtmsService {
    private platformRtmsService: Service;
    readonly #window = inject(WINDOW);

    constructor(
        private userService: UserService,
        private config: RtmsConfig,
        private dslService: DslService,
        rtmsServiceFactory: RtmsServiceFactory,
    ) {
        if (!this.config.isEnabled) {
            return;
        }

        this.platformRtmsService = rtmsServiceFactory.create();

        this.userService.events
            .pipe(
                filter((e: UserEvent) => e instanceof UserLoginEvent),
                first(),
            )
            .subscribe(() => {
                if (this.platformRtmsService.state !== ConnectionState.DISCONNECTED) {
                    this.platformRtmsService.close();
                }

                // TODO: Use WebWorker with unique ID to ensure the callback is executed.
                // Close is async so this guarantees process finishes before calling connect.
                setTimeout(() => this.platformRtmsService.connect(), config.connectionDelayInMilliseconds);
            });

        // Helper to mock RTMS event from the console: `vanillaApp.diagnostics.sendToSocket()`
        vanillaAppExport('diagnostics', 'sendToSocket', (event: NotificationParams) => (this.platformRtmsService.messages as any).next(event));
    }

    /**
     * Gets the messages.
     * For each message, evaluates if the event is disabled according to dynacon condition and do not propagate it's value.
     */
    get messages(): Observable<RtmsMessage> {
        if (this.config.isEnabled) {
            if (this.userService.isAuthenticated || !this.config.establishConnectionOnlyInLoginState) {
                return this.getMessages();
            }

            return this.userService.events.pipe(
                filter((e: UserEvent) => e instanceof UserLoginEvent),
                first(),
                switchMap(() => this.getMessages()),
            );
        }

        return NEVER;
    }

    private getMessages(): Observable<RtmsMessage> {
        return this.platformRtmsService.messages.pipe(
            filter(
                (notification: NotificationParams) =>
                    this.#window.document.visibilityState === 'visible' ||
                    this.config.backgroundEvents?.some((e) => e.toLocaleLowerCase() === notification.type?.toLocaleLowerCase()),
            ),
            switchMap((notification: NotificationParams) =>
                this.dslService.evaluateExpression<boolean>(this.config.disabledEvents[notification.type?.toLowerCase()] || 'false').pipe(
                    first(),
                    filter((disabled: boolean) => !disabled),
                    map(() => notification),
                ),
            ),
        );
    }
}
