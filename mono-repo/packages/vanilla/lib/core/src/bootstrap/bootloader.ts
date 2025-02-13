/**
 * @whatItDoes Returns early started bootloader promise saved on window (i.e to ensure client configs are loaded).
 *
 * @howToUse
 *
 * main.ts
 * ```
 platformBrowserDynamic([bootloaderProvider()]).bootstrapModule(AppModule).catch(err => console.error(err));
 * ```
 *
 * @stable
 */
import { APP_INITIALIZER } from '@angular/core';

export function bootloader(): Promise<void> {
    return (window as any)['_boot'];
}

export const bootloaderProvider = () => {
    return {
        provide: APP_INITIALIZER,
        useFactory: (window as any)['_boot'],
        multi: true,
    };
};
