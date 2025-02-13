import { Injectable, inject } from '@angular/core';

import { NavigationService, WINDOW } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { AdobeTargetConfig } from './adobe-target.client-config';
import { AdobeTargetBaseOptions, AdobeTargetOptions, AdobeTargetResponse } from './adobe-target.models';

@Injectable({
    providedIn: 'root',
})
export class AdobeTargetBackendService {
    readonly #window = inject(WINDOW);

    constructor(
        private config: AdobeTargetConfig,
        private navigation: NavigationService,
    ) {
        this.initTargetOptions();
    }

    private get currentWindow() {
        return <any>this.#window;
    }

    initScript(): Promise<any> {
        const adobe = this.currentWindow.adobe;
        if (adobe !== undefined && adobe.target !== undefined) {
            return Promise.resolve();
        }

        return Promise.reject('window.adobe is not defined.');
    }

    /** Gets target offer. */
    getOffer(options: AdobeTargetOptions): Observable<AdobeTargetResponse> {
        return new Observable((observer) => {
            this.initScript()
                .then(() => {
                    if (!options?.mbox) {
                        observer.error('Mbox parameter not specified.');
                        observer.complete();
                    }

                    const atOpts: AdobeTargetBaseOptions = {
                        success: (response: any) => {
                            if (response && response.length > 0) {
                                observer.next({
                                    offer: response,
                                });
                                observer.complete();
                            } else {
                                observer.error('Empty offer.');
                                observer.complete();
                            }
                        },
                        error: (_status: any, error: any) => {
                            observer.error(error);
                            observer.complete();
                        },
                    };

                    if (options?.mbox) {
                        atOpts.mbox = options.mbox;
                    }

                    if (options?.params) {
                        atOpts.params = options.params;
                    }

                    if (options?.timeout) {
                        atOpts.timeout = options.timeout;
                    }

                    this.currentWindow.adobe.target.getOffer(atOpts);
                })
                .catch((error: unknown) => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    private initTargetOptions() {
        this.config.whenReady.subscribe(() => {
            if (!this.currentWindow.targetGlobalSettings) {
                this.currentWindow.targetGlobalSettings = {
                    cookieDomain: this.navigation.location.hostname,
                };
            }

            if (!this.currentWindow.targetPageParams) {
                this.currentWindow.targetPageParams = () => {
                    return {
                        at_property: this.config.token,
                    };
                };
            }
        });
    }
}
