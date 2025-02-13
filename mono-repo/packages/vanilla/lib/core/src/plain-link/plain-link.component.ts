import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

import { NavigationService } from '../navigation/navigation.service';
import { DynamicHtmlButtonComponentBase } from './dynamic-html-button-component-base';

/**
 * @whatItDoes Handles behavior of standard `a` link with `href` so it goes through angular `Router`
 *
 * @howToUse
 *
 * If this directive is imported, it will be automatically used for all matching links. Is is also used on links inside
 * of rich text in page matrix components.
 *
 * You can set `data-tracking-event="eventName"` and `data-tracking-data.propertyName="value"` to a sitecore link
 * (or other link that uses `PlainLinkComponent`) and the values will be tracked when the link is clicked.
 *
 * @stable
 */
@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'a[href]:not([routerLink]):not([plain-link]):not(a[ds-button])',
    template: '<ng-content />',
})
export class PlainLinkComponent extends DynamicHtmlButtonComponentBase implements OnInit, OnDestroy {
    private omittedUrls: string[] = ['javascript', 'mailto', 'tel'];
    private clickSubject = new Subject<string>();

    constructor(private navigationService: NavigationService) {
        super();
    }

    override ngOnInit() {
        super.ngOnInit();

        this.clickSubject.pipe(exhaustMap((href: string) => this.navigationService.goTo(href))).subscribe();

        if (this.elementRef.nativeElement['originalAttributes']) {
            this.elementRef.nativeElement.href = this.elementRef.nativeElement['originalAttributes'].get('href');
        }
    }

    ngOnDestroy() {
        this.clickSubject.complete();
    }

    processClick(event: Event) {
        const element = event.currentTarget as HTMLAnchorElement;
        const url = element.href;

        if (this.omittedUrls.some((o) => url.startsWith(o))) {
            return;
        }

        if (element.target && element.target !== '_self') {
            return;
        }

        const hrefAttr = element.getAttribute('href');

        event.preventDefault();

        if (hrefAttr === '#' || hrefAttr === '') {
            return;
        }
        this.clickSubject.next(element.href);
    }
}
