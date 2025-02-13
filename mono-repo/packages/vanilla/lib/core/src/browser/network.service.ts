import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { NetworkStatusEvent, NetworkStatusSource } from './browser.models';
import { WindowEvent } from './window/window-ref.service';
import { WINDOW } from './window/window.token';

/**
 * @whatItDoes Provides information about network status.
 *
 * @howToUse
 *
 * ```
 * networkService.events.subscribe((isOnline) => {
 *    // ...
 * });
 *
 * if(networkService.isOnline) {
 *    // ...
 * }
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class NetworkService {
    private readonly statusStream: BehaviorSubject<NetworkStatusEvent>;
    private offlineRequests: number = 0;
    private lastSuccess: number = 0;

    readonly #window = inject(WINDOW);

    constructor() {
        this.statusStream = new BehaviorSubject<NetworkStatusEvent>({
            online: this.#window.navigator.onLine,
            source: NetworkStatusSource.Initial,
        });

        this.#window.addEventListener(
            WindowEvent.Online,
            () => {
                this.resetOfflineRequests();
                this.updateOnlineStatus(NetworkStatusSource.WindowEvent);
            },
            false,
        );
        this.#window.addEventListener(
            WindowEvent.Offline,
            () => {
                this.resetOfflineRequests();
                this.updateOnlineStatus(NetworkStatusSource.WindowEvent);
            },
            false,
        );
    }

    get events(): Observable<NetworkStatusEvent> {
        return this.statusStream;
    }

    get isOnline(): boolean {
        return this.statusStream.value.online;
    }

    /** @internal */
    reportOnlineRequest(timestamp: number) {
        this.offlineRequests = 0;
        this.lastSuccess = timestamp;

        this.updateOnlineStatus(NetworkStatusSource.ApiRequest);
    }

    /** @internal */
    reportOfflineRequest(timestamp: number) {
        if (timestamp > this.lastSuccess) {
            this.offlineRequests++;
        }

        this.updateOnlineStatus(NetworkStatusSource.ApiRequest);
    }

    private resetOfflineRequests() {
        this.offlineRequests = 0;
    }

    private updateOnlineStatus(source: NetworkStatusSource) {
        const online = this.#window.navigator.onLine && this.offlineRequests < 1;

        if (online !== this.isOnline) {
            this.statusStream.next({ source, online });
        }
    }
}
