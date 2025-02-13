import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

import { WINDOW } from '@frontend/vanilla/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TrustAsResourceUrlPipe } from './trust-as-resource-url.pipe';

/**
 * @whatItDoes Allows easier integration with iframes and message communication.
 *
 * @howToUse
 *
 * ```
 * <vn-iframe [url]="url" origin='http://www.bwin.dk' />
 * ```
 *
 * @description
 *
 *  Allows easier integration with iframes and message communication.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [TrustAsResourceUrlPipe],
    selector: 'vn-iframe',
    template: `
        @if (!allowPaymentAttr) {
            <iframe #iframe [attr.src]="url | trustAsResourceUrl" [class]="class"></iframe>
        }
        @if (allowPaymentAttr) {
            <iframe #iframe [attr.src]="url | trustAsResourceUrl" [class]="class" allow="payment"></iframe>
        }
    `,
})
export class IFrameComponent implements AfterViewInit, OnDestroy {
    @Input() url: string;
    @Input() origin: string;
    @Input() class: string;
    @Input() allowPaymentAttr: boolean;
    @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement>;

    get events(): Observable<any> {
        return this.iframeEvents;
    }

    private unsubscribe = new Subject<void>();
    private iframeEvents = new Subject<any>();
    readonly #window = inject(WINDOW);

    constructor(private zone: NgZone) {}

    ngAfterViewInit() {
        this.zone.runOutsideAngular(() =>
            fromEvent<MessageEvent>(this.#window, 'message')
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((event: MessageEvent<any>) => {
                    if (!event || !event.data || !event.origin || !this.origin?.startsWith(event.origin)) {
                        return;
                    }
                    this.iframeEvents.next(event.data);
                }),
        );
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    post<T>(message: T) {
        this.iframe.nativeElement.contentWindow?.postMessage(message, this.origin);
    }
}
