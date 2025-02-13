import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentRef, Injectable } from '@angular/core';

import {
    ContentItem,
    ContentService,
    CookieDBService,
    CookieList,
    CookieName,
    Logger,
    Page,
    ProductService,
    UserEvent,
    UserLoginEvent,
    UserService,
    WebWorkerService,
    WorkerType,
    toBoolean,
} from '@frontend/vanilla/core';
import { isNumber } from 'lodash-es';
import { catchError, first, map } from 'rxjs/operators';

import { HintOverlayService } from './hint-overlay.service';
import { HintComponent } from './hint.component';
import { HintQueueItem } from './hint.models';

/**
 * @whatItDoes Displays hints defined in sitecore with configurable number of displays.
 *
 * @howToUse
 * ```
 * this.hintQueueService.add('hint1'); // the name is reference to a sitecore item 'App-v1.0/Hints/Hint1'. Name can be the name of item or the name of a folder.
 * ```
 *
 * @description
 *
 * All hints content is loaded asynchronously from sitecore folder `App-v1.0/Hints` when first used. Then the names of hints to be shown
 * are stored in a cookie. Once currently shown hint from the queue is hidden (by user clicking on it or a timeout), the next one in the queue is shown.
 *
 * ### Parameters that can be set in sitecore item:
 *
 * `showCloseButton` - show close button.
 * `hintClass` - custom class on hint.
 * `timeOut` - time to live in milliseconds.
 * `displayCounter` - indicates number of times that the hint will be shown after it was closed.
 * `cookieExpireDays` - indicates number of days after hint will be shown again when it was shown max number of times. Use in combination with displayCounter.
 * `isProductSpecific` - indicates if hint is product specific. Use in combination with displayCounter.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class HintQueueService {
    private currentRef: OverlayRef | null;
    private componentRef: ComponentRef<HintComponent> | null;
    private hintsContent: ContentItem[];
    private loading: boolean;
    private db: CookieList<HintQueueItem>;

    constructor(
        private contentService: ContentService,
        private log: Logger,
        private page: Page,
        private user: UserService,
        private hintOverlayService: HintOverlayService,
        private productService: ProductService,
        private webWorkerService: WebWorkerService,
        cookieDBService: CookieDBService,
    ) {
        this.db = cookieDBService.createList(CookieName.HintQueue, this.generateExpiryDate(365));
    }

    add(name: string) {
        if (!name) {
            return;
        }

        name = name.toLowerCase();
        this.removeExpired();

        const isItemInQueue = this.db.getOne((hint: HintQueueItem) => this.predicate(hint, name));

        if (isItemInQueue) {
            this.db.update(
                (hint: HintQueueItem) => this.predicate(hint, name),
                (hint: HintQueueItem) => (hint.shouldShow = true),
            );
        } else {
            this.db.insert({ name, shouldShow: true });
        }

        this.webWorkerService.createWorker(WorkerType.HintQueueTimeout, { timeout: 0 }, () => {
            this.display();
            this.webWorkerService.removeWorker(WorkerType.HintQueueTimeout);
        });
    }

    remove(name: string) {
        if (name) {
            this.db.delete((hint: HintQueueItem) => hint.name === name.toLowerCase());
        }
    }

    clear() {
        this.db.deleteAll();
    }

    // fetch hint based on name and product
    private predicate: (hint: HintQueueItem, name: string) => boolean = (hint: HintQueueItem, name: string) =>
        hint.name === name && (hint.product === this.productService.current.name || !hint.product);

    private removeExpired() {
        this.db.delete((hint: HintQueueItem) => !!hint.expires && new Date().getTime() > hint.expires);
    }

    private display() {
        if (this.currentRef) {
            return;
        }

        if (this.hintsContent) {
            this.showNextHint();
        } else {
            this.loadHints();
        }
    }

    private showNextHint() {
        const item = this.db.getOne((hint: HintQueueItem) => hint.shouldShow && (hint.product === this.productService.current.name || !hint.product));

        if (!item) {
            return;
        }

        const normalizedName = item.name.toLowerCase();
        let hint = this.hintsContent.find((contentItem: ContentItem) => contentItem.name === normalizedName);

        // If the hint name corresponds to folder name in `App-v1.0/Hints` than take the first item from that folder.
        if (hint?.items) {
            hint = hint.items[0];
        }

        if (!hint) {
            this.db.update(
                (hint: HintQueueItem) => this.predicate(hint, item.name),
                (hint: HintQueueItem) => (hint.shouldShow = false),
            );
            this.log.warn(`No content found for hint ${normalizedName}.`);

            if (this.currentRef) {
                this.currentRef.detach();
                return;
            }

            this.showNextHint();

            return;
        }

        if (this.currentRef && this.componentRef) {
            this.componentRef.setInput('hint', hint);

            return;
        }

        if (
            hint.parameters &&
            item.displayCounter &&
            hint.parameters.displayCounter &&
            item.displayCounter >= parseInt(hint.parameters.displayCounter)
        ) {
            this.db.update(
                (hint: HintQueueItem) => this.predicate(hint, item.name),
                (hint: HintQueueItem) => (hint.shouldShow = false),
            );
            this.log.info(`Hint ${normalizedName} is already shown max number of times ${hint.parameters.displayCounter}.`);
            this.showNextHint();

            return;
        }

        [this.currentRef, this.componentRef] = this.hintOverlayService.show(hint);
        this.currentRef.detachments().subscribe(() => {
            if (hint?.parameters?.displayCounter) {
                const cookieExpireDays = hint.parameters.cookieExpireDays
                    ? this.generateExpiryDate(hint.parameters.cookieExpireDays)?.getTime()
                    : undefined;

                const productSpecific = toBoolean(hint.parameters.isProductSpecific) ? this.productService.current.name : undefined;

                this.db.update(
                    (hint: HintQueueItem) => this.predicate(hint, item.name),
                    (hint: HintQueueItem) => {
                        hint.shouldShow = false;
                        hint.displayCounter = (item.displayCounter || 0) + 1;

                        if (cookieExpireDays) {
                            hint.expires = cookieExpireDays;
                        }

                        if (productSpecific) {
                            hint.product = productSpecific;
                        }
                    },
                );
            } else {
                this.db.delete((hint: HintQueueItem) => hint.name === item.name);
            }

            this.currentRef!.dispose();
            this.currentRef = null;
            this.componentRef = null;
            this.showNextHint();
        });
    }

    private loadHints() {
        if (this.loading || this.hintsContent) {
            return;
        }

        this.loading = true;

        if (this.page.isAnonymousAccessRestricted && !this.user.isAuthenticated) {
            this.user.events.pipe(first((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => this.loadHintContent());
        } else {
            this.loadHintContent();
        }
    }

    private loadHintContent() {
        this.contentService
            .getJsonFiltered<ContentItem>('App-v1.0/Hints')
            .pipe(
                map((content: ContentItem) => content.items || []),
                catchError(() => []),
            )
            .subscribe((hints: ContentItem[]) => {
                this.hintsContent = hints;
                this.loading = false;

                if (this.currentRef) {
                    this.showNextHint();
                } else {
                    this.display();
                }
            });
    }

    private generateExpiryDate(days: string | number | null): Date | undefined {
        if (!days) {
            return;
        }

        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + (isNumber(days) ? days : parseInt(days, 10)));

        return expireDate;
    }
}
