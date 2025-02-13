import { Injectable, inject } from '@angular/core';

import { Logger, NativeEvent, WINDOW } from '@frontend/vanilla/core';
import { Observable, Subject } from 'rxjs';

interface EmulatorWindow extends Window {
    messageToNative: (event: NativeEvent) => void;
    messageToWeb: (event: NativeEvent) => void;
    vanillaApp: { native: { messageToWeb: (event: NativeEvent) => void } };
}

/**
 * @whatItDoes Allows to emulate sending wrapper events to web app, and intercepting events from web app to wrapper.
 *
 * @howToUse
 * ```
 * wrapperEmulatorService.emulateMessageToWeb({ eventName: 'EVENT' }); // emulate event sent from wrapper
 *
 * window.messageToWeb({ eventName: 'EVENT' }); // emulate event sent from wrapper, can be used from selenium for e2e testing
 *
 * // intercept event that would be sent from web to wrapper, and emulate response from wrapper.
 * wrapperEmulatorService.eventsFromNative.subscribe(e => {
 *    if(e.eventName === 'SOME_EVENT') {
 *        wrapperEmulatorService.emulateMessageToWeb({ eventName: 'REPLY' });
 *    }
 * });
 * ```
 *
 * @description
 *
 * This service is meant to be used for testing and automation purposes. When wrapper mode is turned on (native route was activated and you
 * have the NativeApp cookie), extra logic is invoked from wrapper that might break the page (e.g. wating to receive an event from wrapper
 * on startup would prevent the page load). With this service you can mock such events and provide reasonable defaults or emulate wrapper
 * behavior by storing state in local storage or similar providers.
 *
 * This behavior will only be enabled when [dynacon flag](https://admin.dynacon.prod.env.works/services/87656/features/88113/keys/102270/valuematrix?_matchAncestors=true)
 * is set to true.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class WrapperEmulatorService {
    private log = inject(Logger);

    private window: EmulatorWindow;
    private eventsSentToNative = new Subject<NativeEvent>();
    readonly #window = inject(WINDOW);

    get eventsToNative(): Observable<NativeEvent> {
        return this.eventsSentToNative;
    }

    constructor() {
        this.window = this.#window as EmulatorWindow;
    }

    /** @internal */
    initialize() {
        this.window.messageToNative = (e) => {
            this.eventsSentToNative.next(e);
            this.log.debug(`[WrapperEmulator] Event '${e.eventName}' sent to native: `, e);
        };

        this.window.messageToWeb = (e) => {
            this.emulateMessageToWeb(e);
        };
    }

    emulateMessageToWeb(event: NativeEvent) {
        this.window.vanillaApp.native.messageToWeb(event);
        this.log.debug(`[WrapperEmulator] Event '${event.eventName}' sent to web: `, event);
    }
}
