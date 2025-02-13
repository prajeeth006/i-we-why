import { ElementRef } from '@angular/core';

import { Mock, Stub } from 'moxxi';

@Mock({ of: ElementRef })
export class ElementRefMock extends ElementRef {
    override nativeElement: HtmlElementMock;

    constructor() {
        super(null);

        this.nativeElement = new HtmlElementMock();
    }
}

export class HtmlElementMock {
    classList = new HtmlElementClassListMock();
    style = new HtmlElementStyleMock();

    @Stub() addEventListener: jasmine.Spy;
    @Stub() blur: jasmine.Spy;
    @Stub() getBoundingClientRect: jasmine.Spy;
    @Stub() getElementsByClassName: jasmine.Spy;
    @Stub() querySelector: jasmine.Spy;
    @Stub() querySelectorAll: jasmine.Spy;
    @Stub() removeEventListener: jasmine.Spy;
    @Stub() scrollIntoView: jasmine.Spy;
    @Stub() scrollTo: jasmine.Spy;
    @Stub() select: jasmine.Spy;
    @Stub() setAttribute: jasmine.Spy;

    scrollTop: number;
    href: string;
    rel: string;
    type: string;
    media: string;
    offsetHeight: number = 0;
    offsetTop: number = 0;
    offsetParent: HtmlElementMock;
    dataset: DOMStringMap;
    contentWindow: any;
}

export class HtmlElementClassListMock {
    @Stub() add: jasmine.Spy;
    @Stub() remove: jasmine.Spy;
    @Stub() contains: jasmine.Spy;
}

export class HtmlElementStyleMock {
    @Stub() removeProperty: jasmine.Spy;
    @Stub() setProperty: jasmine.Spy;
    @Stub() getPropertyValue: jasmine.Spy;
    backgroundImage: string;
    top: string | null;
    right: string | null;
    bottom: string | null;
    left: string | null;
    paddingTop: string | null;
    width: string | null;
    height: string | null;
}
