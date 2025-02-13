import { Injectable, inject } from '@angular/core';

import { WINDOW } from './window/window.token';

/**
 * Script attribute options
 *
 * @stable
 */
export interface ScriptOptions {
    async?: boolean;
    defer?: boolean;
    crossorigin?: 'anonymous' | 'use-credentials';
    onloadCallback?: () => void;
}

/**
 * @whatItDoes Provides injecting of dynamic scripts in the body element.
 *
 * @howToUse
 *
 * ```
 * this.dynamicScriptsService.load('source', <ScriptOptions>{ ... }?);
 * ```
 *
 * @description
 *
 * This service provides a way to inject scripts dynamically.
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class DynamicScriptsService {
    readonly #window = inject(WINDOW);

    /** Returns a Promise that loads the script.
     *  @param  {string} [source] The script source.
     *  @param  {ScriptOptions} [options] script attribute options: async; defer; crossorigin.
     * */
    load(source: string, options?: ScriptOptions): Promise<void> {
        if (!source) {
            throw new Error('Source must be defined');
        }

        return new Promise((resolve, reject) => {
            const document = this.#window.document;

            const scriptElement = document.createElement('script');

            if (options?.async) {
                scriptElement.setAttribute('async', 'async');
            }

            if (options?.defer) {
                scriptElement.setAttribute('defer', 'defer');
            }

            if (options?.crossorigin) {
                scriptElement.setAttribute('crossorigin', options.crossorigin);
            }

            scriptElement.onload = () => {
                if (options?.onloadCallback) {
                    options.onloadCallback();
                }
                resolve();
            };

            scriptElement.onerror = () => {
                reject();
            };

            scriptElement.src = source;
            document.body.appendChild(scriptElement);
        });
    }
}
