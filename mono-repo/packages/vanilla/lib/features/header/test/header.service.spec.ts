import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { DynamicComponentsRegistry, MenuContentItem, VanillaElements } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { ResizeObserverServiceMock } from '../../../core/src/browser/resize-observer.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { HeaderService } from '../src/header.service';
import { HeaderConfigMock } from './header.mock';

class SampleComponent {}

describe('HeaderService', () => {
    let service: HeaderService;
    let pageMock: PageMock;
    let isHeaderShown: boolean;
    let elementRepositoryServiceMock: ElementRepositoryServiceMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let responsiveHeaderContentMock: HeaderConfigMock;
    let navigationServiceMock: NavigationServiceMock;
    let urlServiceMock: UrlServiceMock;
    let currentProduct: MenuContentItem | null;
    let resizeObserverMock: ResizeObserverServiceMock;
    let doc: Document;

    beforeEach(() => {
        responsiveHeaderContentMock = MockContext.useMock(HeaderConfigMock);
        pageMock = MockContext.useMock(PageMock);
        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        resizeObserverMock = MockContext.useMock(ResizeObserverServiceMock);
        MockContext.useMock(DslServiceMock);
        responsiveHeaderContentMock.products.push({ name: 'random page 1', parameters: { 'highlight-url-pattern': '/p/onecolpage$' } } as any);
        responsiveHeaderContentMock.products.push({ name: 'random page 2', parameters: {}, url: 'http://bwin.com/somepath' } as any);
        responsiveHeaderContentMock.products.push({ name: 'random page 3', parameters: { 'highlight-url-pattern': '/somepath$' } } as any);
        responsiveHeaderContentMock.products.push({ name: 'random page 4', parameters: {} } as any);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, HeaderService, DynamicComponentsRegistry],
        });

        pageMock.product = 'Testweb';
        service = TestBed.inject(HeaderService);
        doc = TestBed.inject(DOCUMENT);
        service.highlightedProduct.subscribe((v) => (currentProduct = v));
        service.display.subscribe((s) => (isHeaderShown = s));
        setupUrl('http://bwin.com/sports');
        setupUrl('http://bwin.com/testweb');
        setupUrl('http://bwin.com/somepath');
    });

    function setupUrl(url: string) {
        const parser = doc.createElement('a');
        parser.setAttribute('href', url);
        const parsedUrl = new ParsedUrlMock();
        parsedUrl.isSameHost = parser.host === 'bwin.com';
        parsedUrl.baseUrl.and.returnValue(parser.protocol + '//' + parser.host);
        parsedUrl.path.and.returnValue(parser.pathname);
        urlServiceMock.parse.withArgs(url).and.returnValue(parsedUrl);
    }

    describe('getHeaderHeight()', () => {
        it('should return height of the header slot element', () => {
            const header = new HtmlElementMock();
            resizeObserverMock.observe
                .withArgs(header)
                .and.returnValue(new BehaviorSubject({ contentBoxSize: [{ blockSize: 100, inlineSize: 50 }] }));
            elementRepositoryServiceMock.elements$.next(new Map([[VanillaElements.HEADER_SLOT, header]]));
            expect(service.getHeaderHeight()).toBe(50);
        });

        it('should return 0 if header is not present on the page', () => {
            elementRepositoryServiceMock.elements$.next(new Map([]));
            expect(service.getHeaderHeight()).toBe(0);
        });
    });

    describe('highlightProduct()', () => {
        beforeEach(() => {
            service.initProductHighlighting();
            setUrl('http://bwin.com', '/');
            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });
        });

        it('should emit an event with on observable with specified product', () => {
            expect(currentProduct!.name).toBe('testweb');

            service.highlightProduct('sports');

            expect(currentProduct!.name).toBe('sports');
        });

        it('should highlight current product', () => {
            expect(currentProduct!.name).toBe('testweb');
        });

        it('should use current product if null is specified', () => {
            service.highlightProduct('sports');
            service.highlightProduct(null);

            expect(currentProduct!.name).toBe('testweb');
        });

        it('should highlight product with matched pattern', () => {
            setUrl('http://bwin.com', '/en/p/onecolpage');

            service.highlightProduct(null);

            expect(currentProduct!.name).toBe('random page 1');
        });

        it('should highlight product with matched url and prefer exact match over pattern', () => {
            setUrl('http://bwin.com', '/somepath');

            service.highlightProduct(null);

            expect(currentProduct!.name).toBe('random page 2');
        });

        it('should highlight product with matched url exists even if one was specified', () => {
            setUrl('http://bwin.com', '/en/p/onecolpage');

            service.highlightProduct('sports');

            expect(currentProduct!.name).toBe('random page 1');
        });

        it('should highlight product on navigation', () => {
            setUrl('http://bwin.com', '/en/p/onecolpage');

            navigationServiceMock.locationChange.next({ id: 0, nextUrl: '', previousUrl: '' });

            expect(currentProduct!.name).toBe('random page 1');
        });

        function setUrl(baseUrl: string, path: string) {
            navigationServiceMock.location.baseUrl.and.returnValue(baseUrl);
            navigationServiceMock.location.path.and.returnValue(path);
        }
    });

    describe('version()', () => {
        it('should get correct version', () => {
            responsiveHeaderContentMock.version = 2;

            expect(service.version).toBe(2);
        });
    });

    describe('setItemCounter()', () => {
        it('should set item counter', () => {
            service.setItemCounter('myaccount', 5, 'red');

            expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('Header', 'myaccount', 5, 'red');
        });
    });

    describe('show(), hide()', () => {
        it('should be shown by default', () => {
            expect(isHeaderShown).toBeTrue();
        });

        it('should hide', () => {
            service.hide();

            expect(isHeaderShown).toBeFalse();
        });

        it('should show', () => {
            service.hide();
            service.show();

            expect(isHeaderShown).toBeTrue();
        });
    });

    describe('itemDisabled()', () => {
        beforeEach(() => {
            service.show(['header_sections']);
        });
        it('should return true if item is in list of disabled', () => {
            expect(service.itemDisabled('header_sections')).toBeTrue();
        });

        it('should return false if item is not in list of disabled', () => {
            expect(service.itemDisabled('header_bottom_items')).toBeFalse();
        });
    });

    describe('menu item templates', () => {
        it('should allow to set menu item templates', () => {
            service.setHeaderComponent('type', SampleComponent);

            expect(service.getHeaderComponent('type')).toBe(SampleComponent);
        });

        it('should allow to set default item template', () => {
            service.setHeaderComponent('button', SampleComponent);

            expect(service.getHeaderComponent(undefined)).toBe(SampleComponent);
        });
    });
});
