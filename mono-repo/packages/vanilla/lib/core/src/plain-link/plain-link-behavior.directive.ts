import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

import { Subject } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

import { NavigationService } from '../navigation/navigation.service';
import { LinkBehaviorDirective } from './link-behavior.directive';

@Directive({
    standalone: true,
    host: { '(click)': 'processClick($event)' },
    hostDirectives: [LinkBehaviorDirective],
})
export class PlainLinkBehaviorDirective implements OnInit, OnDestroy {
    private omittedUrls: string[] = ['javascript', 'mailto', 'tel'];
    private clickSubject = new Subject<string>();
    private navigationService = inject(NavigationService);
    private elementRef = inject(ElementRef<HTMLAnchorElement>);
    ngOnInit() {
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
        const linkNavigate = element.getAttribute('linknavigation');
        if (linkNavigate === 'no') {
            event.preventDefault();
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
