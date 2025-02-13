import { Injectable } from '@angular/core';

import { DslService, FormElementTemplateForClient, ViewTemplateForClient } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, first } from 'rxjs';

import { LoginContent } from './login-content.client-config';

/**
 * @whaItDoes evaluates loginPage content from {@link LoginContent.loginPage} and exposes results for further use.
 *
 * ```
 * // make sure that initialized is call so content is evaluated
 * const forms = this.loginContentService.content.form;
 * ```
 * ```
 * // evaluate content
 * await firstValueFrom(this.loginContentService.initialized);
 * ```
 *
 * @description Enables caching of {@link LoginContent} client config call on client and CDN because it evaluates content on client side.
 *
 * @experimental
 */
@Injectable({ providedIn: 'root' })
export class LoginContentService {
    get initialized(): Observable<boolean> {
        return this.initializedEvents;
    }

    get content(): ViewTemplateForClient | FormElementTemplateForClient {
        return this.loginPageContent;
    }

    private loginPageContent: ViewTemplateForClient | FormElementTemplateForClient;
    private initializedEvents: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private loginContent: LoginContent,
        private dslService: DslService,
    ) {
        this.loginContent.whenReady.pipe(first()).subscribe(() => {
            this.dslService
                .evaluateContent(this.loginContent.loginPage)
                .pipe(first())
                .subscribe((result: ViewTemplateForClient) => {
                    this.loginPageContent = result;

                    for (const key in result.proxy) {
                        const value = result.proxy[key];

                        if (value && 'id' in value) {
                            // FormElementTemplateForClient
                            this.loginPageContent.form[key] = value;
                        } else {
                            this.loginPageContent.children[key] = <ViewTemplateForClient>value;
                        }
                    }

                    this.initializedEvents.next(true);
                });
        });
    }
}
