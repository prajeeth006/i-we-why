import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

import { CustomElement, toBoolean } from '@frontend/vanilla/core';

import { ContentMessageComponent } from './content-message.component';

/**
 * This is automatically tested in tests of ContentMessageComponent.
 */
@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '.message-close',
    template: '<span></span>',
})
export class CloseMessageComponent implements OnInit {
    private showOnNextSession: boolean | undefined;
    private showOnNextLogin: boolean | undefined;

    constructor(
        private parent: ContentMessageComponent,
        private elementRef: ElementRef<HTMLElement>,
    ) {
        this.showOnNextSession = toBoolean(elementRef.nativeElement.getAttribute('data-show-on-next-session'));
        this.showOnNextLogin = toBoolean(elementRef.nativeElement.getAttribute('data-show-on-next-login'));
    }

    ngOnInit() {
        this.elementRef.nativeElement.innerHTML = (<CustomElement>this.elementRef.nativeElement).originalHtmlString;
    }

    @HostListener('click')
    onClick() {
        this.parent.closeMessage(this.showOnNextSession, this.showOnNextLogin);
    }
}
