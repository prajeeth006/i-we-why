import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { MenuItemHighlightService } from '../src/menu-item-highlight.service';

describe('MenuItemHighlightService', () => {
    let service: MenuItemHighlightService;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(UrlServiceMock);
        MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MenuItemHighlightService],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(MenuItemHighlightService);
    });

    describe('initHighlighting()', () => {
        it('should create macher list', () => {
            const menuitems = [{ text: 'account', parameters: { 'highlight-url-pattern': '/menu' } }] as any;
            service.initHighlighting(menuitems);

            expect(service.regexProductHighlightMatchers.length).toBe(1);
        });
    });

    describe('setHighlightedProduct()', () => {
        it('should find match and set product to highlight', () => {
            navigationServiceMock.location.baseUrl.and.returnValue('https://abc.intranet');
            navigationServiceMock.location.path.and.returnValue('/en/menu');
            const menuitems = [{ text: 'account', parameters: { 'highlight-url-pattern': '/menu' } }] as any;

            service.initHighlighting(menuitems);
            const product = service.setHighlightedProduct(menuitems, null);
            expect(product?.text).toBe('account');
        });
    });
});
