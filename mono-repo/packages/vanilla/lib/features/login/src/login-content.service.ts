import { Injectable, inject } from '@angular/core';

import { DslService, FormElementTemplateForClient, ProxyItemForClient, ViewTemplateForClient } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, filter, first } from 'rxjs';

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
    private loginContent = inject(LoginContent);
    private dslService = inject(DslService);
    private loginPageContent: ViewTemplateForClient;

    get initialized(): Observable<boolean> {
        return this.initializedEvents.pipe(filter((c) => c));
    }

    get content(): ViewTemplateForClient {
        return this.loginPageContent;
    }

    private initializedEvents: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() {
        this.loginContent.whenReady.pipe(first()).subscribe(() => {
            this.dslService
                .evaluateContent(this.loginContent.loginPage)
                .pipe(first())
                .subscribe((result) => {
                    this.loginPageContent = result;
                    for (const key in result.proxy) {
                        const value = result.proxy[key]!;
                        if (this.isFormElementTemplateForClient(value)) {
                            this.loginPageContent.form[key] = <FormElementTemplateForClient>value;
                        } else {
                            this.loginPageContent.children[key] = <ViewTemplateForClient>value;
                        }
                    }
                    this.initializedEvents.next(true);
                });
        });
    }

    private isFormElementTemplateForClient(item: ProxyItemForClient | FormElementTemplateForClient | ViewTemplateForClient) {
        return 'id' in item;
    }
}
