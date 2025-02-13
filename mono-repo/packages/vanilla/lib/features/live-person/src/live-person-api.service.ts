import { Injectable, inject } from '@angular/core';

import { AppInfoConfig, Page, UserService, WINDOW, WebWorkerService, WorkerType } from '@frontend/vanilla/core';

import { LivePersonConfig } from './live-person.client-config';
import { LivePersonChat } from './live-person.models';

/**
 * @whatItDoes Provides a thin wrapper around the global `window.bwin.livepersonchat` api object.
 *
 * @howToUse
 *
 * Make sure that the `livepersonchat` script has been loaded and the global `window.bwin.livepersonchat` object is present.
 *
 * See also https://developers.liveperson.com/consumer-experience-javascript-chat-getting-started.html for more information.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LivePersonApiService {
    private onScriptLoaded: () => void;
    private scriptPromise: Promise<void>;
    private readonly globalLivePersonApi: LivePersonChat | undefined;

    readonly #window = inject(WINDOW);

    constructor(
        private appInfoConfig: AppInfoConfig,
        private userService: UserService,
        private livePersonConfig: LivePersonConfig,
        private page: Page,
        private webWorkerService: WebWorkerService,
    ) {
        this.globalLivePersonApi = this.#window.bwin?.livepersonchat;
    }

    /**
     * Sends a Live Person event with the given event name and data.
     */
    triggerEvent(eventName: string, data: any): Promise<void> {
        return this.loadScriptData().then(() => {
            if (!this.livePersonConfig.showInvite) {
                this.globalLivePersonApi?.handlePushChatShowInvite();
            }

            const eventParams = {
                brand: this.appInfoConfig.brand,
                channel: this.appInfoConfig.channel,
                language: this.userService.lang,
                culture: this.page.culture,
                frontend: this.appInfoConfig.frontend,
                product: this.appInfoConfig.product,
                accountName: this.userService.username,
                moneyCategory: '',
                loyalty: '',
            };

            if (this.userService.isAuthenticated) {
                Object.assign(eventParams, {
                    moneyCategory: this.userService.realPlayer ? 'real' : 'play',
                    loyalty: this.userService.loyalty,
                });
            }

            this.globalLivePersonApi?.sendLivepersonEvent(eventName, data, eventParams);
        });
    }

    /**
     * Calls triggerSectionOpen(section) on the underlying Live Person api.
     */
    triggerSectionOpen(section: string): Promise<any> {
        return this.loadScriptData().then(() => this.globalLivePersonApi?.triggerSectionOpen(section));
    }

    private loadScriptData(): Promise<void> {
        if (!this.globalLivePersonApi) {
            return Promise.reject('Live Person Api script not present. Most probably script is not included.');
        }

        if (!this.globalLivePersonApi.isLivePersonPushChatEnabled) {
            return Promise.reject('Live Person Api is disabled.');
        }

        this.scriptPromise = this.scriptPromise || new Promise<void>((resolve) => (this.onScriptLoaded = resolve));
        this.globalLivePersonApi.loadScriptData();

        this.webWorkerService.createWorker(WorkerType.LivePersonInterval, { interval: 250 }, () => {
            if (this.#window.lpTag?.started) {
                this.onScriptLoaded();
                this.webWorkerService.removeWorker(WorkerType.LivePersonInterval);
            }
        });

        return this.scriptPromise;
    }
}
