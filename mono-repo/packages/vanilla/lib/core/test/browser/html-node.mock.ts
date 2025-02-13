import { HtmlNode } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: HtmlNode })
export class HtmlNodeMock {
    @Stub() setCssClass: jasmine.Spy;
    @Stub() toggleVisibilityClass: jasmine.Spy;
    @Stub() hasCssClass: jasmine.Spy;
    @Stub() setAttribute: jasmine.Spy;
    @Stub() getAttribute: jasmine.Spy;
    @Stub() blockScrolling: jasmine.Spy;
    @Stub() hasBlockScrolling: jasmine.Spy;
}
