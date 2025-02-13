import { Injectable, inject } from '@angular/core';

import { DeviceService, NativeAppService, NativeEventType, WINDOW } from '@frontend/vanilla/core';

/**
 * @whatItDoes Represents service to interact with Web Share API.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class ShareService {
    private deviceService = inject(DeviceService);
    private nativeAppService = inject(NativeAppService);
    readonly #window = inject(WINDOW);

    /**
     * Shares data using Web Share API.
     * @param data Data to share.
     * @param eventName Event name used to notify native app.
     * @returns `true` if sharing was successful, `false` otherwise.
     */
    async share(data: ShareData, eventName: string = NativeEventType.SHARE): Promise<boolean> {
        if (this.deviceService.isAndroid && this.nativeAppService.isNativeWrapper) {
            this.nativeAppService.sendToNative({
                eventName,
                parameters: data,
            });

            return true;
        }

        if (!this.#window.navigator.share) {
            return false;
        }

        try {
            await this.#window.navigator.share(data);

            return true;
        } catch {
            return false;
        }
    }
}
