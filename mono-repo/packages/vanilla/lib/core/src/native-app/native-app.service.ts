import { Injectable, NgZone, inject } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import { WINDOW } from '../browser/window/window.token';
import { Logger } from '../logging/logger';
import { toJson } from '../utils/convert';
import { UtilsService } from '../utils/utils.service';
import { NativeAppConfig } from './native-app.client-config';
import { NativeEvent, NativeWindow } from './native-app.models';

/**
 * @whatItDoes Indicates whether we are in app/wrapper context, and has information about app name and product id. Also allows communication from/to an app.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class NativeAppService {
    private nativeEvents: Subject<NativeEvent> = new Subject<NativeEvent>();
    private tracingBlacklistPattern: RegExp;

    readonly #window = inject(WINDOW);

    constructor(
        private config: NativeAppConfig,
        private logger: Logger,
        private utils: UtilsService,
        private zone: NgZone,
    ) {
        this.tracingBlacklistPattern = new RegExp(this.config.tracingBlacklistPattern ?? '(?!)');
    }

    get context(): string {
        if (this.#window.self !== this.#window.top) {
            return 'iframe';
        }

        return 'default';
    }

    /**
     * Shortcut for `isNativeApp || isNativeWrapper || isDownloadClient || isTerminal`.
     */
    get isNative(): boolean {
        return this.config.isNative;
    }

    get isNativeApp(): boolean {
        return this.config.isNativeApp;
    }

    get isNativeWrapper(): boolean {
        return this.config.isNativeWrapper;
    }

    get isNativeWrapperODR(): boolean {
        return this.config.isNativeWrapper && this.config.applicationName.toLowerCase().includes('odr');
    }

    get isDownloadClient(): boolean {
        return this.config.isDownloadClient;
    }

    get isDownloadClientApp(): boolean {
        return this.config.isDownloadClientApp;
    }

    get isDownloadClientWrapper(): boolean {
        return this.config.isDownloadClientWrapper;
    }

    get isTerminal(): boolean {
        return this.config.isTerminal;
    }

    get product(): string {
        return this.config.product;
    }

    get applicationName(): string {
        return this.config.applicationName;
    }

    get nativeScheme(): string {
        const override = this.#window['__NativeSchemeOverride'];

        return override || 'bwin://';
    }

    get playtechNativeScheme(): string {
        return 'htcmd:';
    }

    get nativeMode(): string {
        return this.config.nativeMode;
    }

    get htcmdSchemeEnabled(): boolean | undefined {
        return this.config.htcmdSchemeEnabled;
    }

    /** Subscribe to events sent by the native app. */
    get eventsFromNative(): Observable<NativeEvent> {
        return this.nativeEvents;
    }

    /** Send an CCB event to native app. */
    sendToNative(event: NativeEvent) {
        const message = 'Sending CCB via ';

        if (this.config.disabledEvents.includes(event.eventName)) {
            this.logEvent(event, 'Not sending disabled CCB', '', false);
            return;
        }

        const window = <NativeWindow>(<any>this.#window);

        event = { ...event, id: this.utils.generateGuid() };

        if (window.messageToZendesk) {
            this.logEvent(event, message, 'messageToZendesk', false);
            window.messageToZendesk(event);
        }

        if (window.messageToNative) {
            this.logEvent(event, message, 'messageToNative');
            window.messageToNative(event);
        } else if (window.external && window.external.NativeDispatch) {
            this.logEvent(event, message, 'external.NativeDispatch');
            window.external.NativeDispatch(event.eventName, JSON.stringify(event.parameters));
        } else if (window.webkit?.messageHandlers?.observer?.postMessage) {
            this.logEvent(event, message, 'webkit.messageHandlers.observer.postMessage');
            window.webkit.messageHandlers.observer.postMessage(event.eventName, JSON.stringify(event.parameters));
        }
    }

    /** @internal */
    onReceivedEventFromNative(event: NativeEvent | string) {
        this.zone.run(() => {
            const nativeEvent = toJson(event);
            this.nativeEvents.next(nativeEvent);
            this.logEvent(nativeEvent, 'Received CCB');
        });
    }

    private logEvent(event: NativeEvent, desc: string, channel: string = '', shouldTrace: boolean = true) {
        const message = `${desc}${channel}: `;

        if (this.config.enableCCBDebug) {
            this.logger.info(message, event);
        }

        if (this.config.enableCCBTracing && shouldTrace && !this.tracingBlacklistPattern.test(event?.eventName)) {
            const remoteMessage =
                message +
                JSON.stringify(event, (key, val) => {
                    if (key.toLowerCase().indexOf('password') !== -1) {
                        return '***';
                    }

                    return val;
                });

            this.logger.infoRemote(remoteMessage);
        }
    }
}
