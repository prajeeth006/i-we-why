import { Injectable, inject } from '@angular/core';

import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable, fromEvent } from 'rxjs';
import { catchError, first, map, publishReplay, refCount, switchMap, takeUntil } from 'rxjs/operators';

import { CookieDBService } from '../browser/cookie/cookie-db.service';
import { CookieList } from '../browser/cookie/cookie-list';
import { WINDOW } from '../browser/window/window.token';
import { Page } from '../client-config/page.client-config';
import { ContentItem } from '../content/content.models';
import { ContentService } from '../content/content.service';
import { ClientConfigProductName, CookieName, UserEvent } from '../core';
import { DslService } from '../dsl/dsl.service';
import { Logger } from '../logging/logger';
import { TrackingService } from '../tracking/tracking-core.service';
import { UserLoginEvent } from '../user/user-events';
import { UserService } from '../user/user.service';
import { toBoolean } from '../utils/convert';
import { ToastrDynamicComponentsRegistry } from './toastr-dynamic-components-registry';
import { ToastrOptionsBuilder } from './toastr-options-builder';
import { ToastrQueueCurrentToastContext } from './toastr-queue-current-toast-context';
import { ToastrItem, ToastrQueueItem, ToastrQueueOptions, ToastrSchedule } from './toastr.models';

/**
 * @whatItDoes Displays toast messages defined in sitecore with scheduling options. It also can display custom toast message without the sitecore content.
 *
 * @howToUse
 * ```
 * this.toastrQueueService.add('toast1'); // the name is reference to a sitecore item 'App-v1.0/Toasts/Toast1'
 * this.toastrQueueService.add('toast2', { schedule: ToastrSchedule.AfterNextNavigation }); // shows the toast after the next navigation (or page reload)
 * this.toastrQueueService.add('customname', customToastr: { customComponent: 'redToastr', type: 'info', parameters: { disableTimeOut: true, toastClass: 'toast toast-rg' }); // show the custom toast
 * ```
 *
 * All toasts content is loaded asynchronously from sitecore node `App-v1.0/Toasts/Toast1` when first used. Then the names of toasts to be shown
 * are stored in a cookie. Once currently shown toast from the queue is hidden (by user clicking on it or a timeout), the next one in the queue is
 * shown and removed from the cookie.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ToastrQueueService {
    private currentToastContext: ToastrQueueCurrentToastContext | null;
    private toastsContent$: Observable<ContentItem[]>;
    private loading: boolean;
    private waiting: boolean;
    private db: CookieList<ToastrQueueItem>;
    readonly #window = inject(WINDOW);

    constructor(
        cookieDBService: CookieDBService,
        private toastrService: ToastrService,
        private contentService: ContentService,
        private toastrOptionsBuilder: ToastrOptionsBuilder,
        private log: Logger,
        private page: Page,
        private user: UserService,
        private dslService: DslService,

        private toastrDynamicComponentsRegistry: ToastrDynamicComponentsRegistry,
        private trackingService: TrackingService,
    ) {
        this.db = cookieDBService.createList(CookieName.ToastrQueue);
    }

    get currentToast(): ToastrQueueCurrentToastContext | null {
        return this.currentToastContext;
    }

    private static generateToastrItem(
        title: string | undefined,
        message: string | undefined,
        type: string | undefined,
        options: Partial<IndividualConfig> = {},
    ): ToastrItem {
        const toastrItem: ToastrItem = {};

        if (title) {
            toastrItem.title = title;
        }
        if (message) {
            toastrItem.message = message;
        }
        if (type) {
            toastrItem.type = type;
        }
        if (options) {
            toastrItem.options = options;
        }

        return toastrItem;
    }

    add(name: string, options?: Partial<ToastrQueueOptions>) {
        if (!name) {
            return;
        }

        const toastrQueueItem: ToastrQueueItem = {
            name: name.toLowerCase(),
            schedule: options?.schedule || ToastrSchedule.Immediate,
        };

        if (options?.placeholders) {
            toastrQueueItem.p = options.placeholders;
        }

        if (options?.customToastr) {
            toastrQueueItem.customToastr = options.customToastr;
        }

        this.db.insert(toastrQueueItem);
        this.display();
    }

    remove(name?: string) {
        if (name) {
            this.db.deleteFirstMatch((toastr: ToastrQueueItem) => toastr.name === name.toLowerCase());
        }
    }

    clear() {
        this.db.deleteAll();
    }

    /** @internal */
    onNavigation() {
        this.db.updateAll((toastr: ToastrQueueItem) => (toastr.schedule = ToastrSchedule.Immediate));

        if (this.currentToastContext && this.currentToastContext.hideOnNavigation) {
            this.currentToastContext.toast.toastRef.manualClose();
        }

        this.display();
    }

    private display() {
        if (this.currentToastContext || this.waiting) {
            return;
        }

        if (this.toastsContent$) {
            this.showNextToast();
        } else {
            this.loadToasts();
        }
    }

    private showNextToast() {
        const item = this.db.getOne((toastr: ToastrQueueItem) => toastr.schedule === ToastrSchedule.Immediate);

        if (!item) {
            return;
        }

        this.waiting = true;
        this.remove(item.name);

        this.toastsContent$
            .pipe(
                switchMap((items: ContentItem[]) => this.dslService.evaluateContent(items)),
                first(),
            )
            .subscribe((toastContent: ContentItem[]) => {
                let toastrItem: ToastrItem = {};
                let context: ToastrQueueCurrentToastContext;

                if (item.customToastr) {
                    const customComponentType = this.toastrDynamicComponentsRegistry.get(item.customToastr.customComponent);

                    if (!customComponentType) {
                        this.log.warn(`No custom component found for toast template name ${item.customToastr.customComponent}.`);
                        this.setWaitingToFalseAndShowNextToast();
                        return;
                    }

                    toastrItem = ToastrQueueService.generateToastrItem(
                        item.customToastr.title,
                        item.customToastr.message,
                        item.customToastr.type,
                        item.customToastr.parameters,
                    );

                    if (toastrItem.options) {
                        toastrItem.options.toastComponent = customComponentType;
                    }

                    context = this.currentToastContext = new ToastrQueueCurrentToastContext({} as ContentItem, item.p || {});
                } else {
                    const content = toastContent.find((contentItem: ContentItem) => contentItem.name === item.name.toLowerCase());

                    if (!content) {
                        this.log.warn(`No content found for toast: ${item.name.toLowerCase()}.`);
                        this.setWaitingToFalseAndShowNextToast();
                        return;
                    }

                    context = this.currentToastContext = new ToastrQueueCurrentToastContext(content, item.p || {});
                    toastrItem = ToastrQueueService.generateToastrItem(
                        context.content.title,
                        context.content.text,
                        context.content.parameters?.['type'],
                        this.toastrOptionsBuilder.build(context.content),
                    );
                }
                try {
                    const iconClass = toastrItem.type && this.toastrService.toastrConfig.iconClasses[toastrItem.type];
                    const toast = this.toastrService.show(toastrItem.message, toastrItem.title, toastrItem.options, iconClass);

                    this.waiting = false;
                    this.currentToastContext.setToast(toast);

                    if (context.content.parameters != null && toBoolean(context.content.parameters['hideOnScroll'])) {
                        fromEvent(this.#window, 'scroll')
                            .pipe(first(), takeUntil(toast.onHidden))
                            .subscribe(() => {
                                toast.toastRef.manualClose();
                            });
                    }

                    if (context.content.parameters != null && toBoolean(context.content.parameters['hideOnClick'])) {
                        fromEvent(this.#window, 'click')
                            .pipe(first(), takeUntil(toast.onHidden))
                            .subscribe(() => {
                                toast.toastRef.manualClose();
                            });
                    }

                    this.trackingService.trackContentItemEvent(context.content.parameters, 'tracking.LoadedEvent');
                    toast.onHidden.subscribe(() => {
                        this.trackingService.trackContentItemEvent(context.content.parameters, 'tracking.ClosedEvent');
                        this.currentToastContext = null;
                        this.showNextToast();
                    });
                } catch {
                    this.currentToastContext = null;
                    this.setWaitingToFalseAndShowNextToast();
                }
            });
    }

    private loadToasts() {
        if (this.loading || this.toastsContent$) {
            return;
        }

        this.loading = true;

        if (this.page.isAnonymousAccessRestricted && !this.user.isAuthenticated) {
            this.user.events.pipe(first((event: UserEvent) => event instanceof UserLoginEvent)).subscribe(() => this.loadToastContent());
        } else {
            this.loadToastContent();
        }
    }

    private loadToastContent() {
        this.toastsContent$ = this.contentService.getJson('App-v1.0/Toasts', { product: ClientConfigProductName.SF, filterOnClient: true }).pipe(
            map((c) => c.items || []),
            catchError(() => []),
            publishReplay(1),
            refCount(),
        );

        this.toastsContent$.pipe(first()).subscribe(() => this.display());
    }

    private setWaitingToFalseAndShowNextToast() {
        this.waiting = false;
        this.showNextToast();
    }
}
