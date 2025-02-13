import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { HtmlNode, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';

describe('HtmlNode', () => {
    let htmlNode: HtmlNode;
    let doc: Document;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HtmlNode],
        });

        doc = TestBed.inject(DOCUMENT);
        htmlNode = TestBed.inject(HtmlNode);

        doc.documentElement.setAttribute('class', '');
    });

    describe('toggleVisibilityClass', () => {
        it('should add feature-shown class to html node', () => {
            htmlNode.toggleVisibilityClass('test', true);

            expect('html').toHaveClass('test-shown');
            expect('html').not.toHaveClass('test-hidden');
        });

        it('should add feature-hidden class to html node', () => {
            htmlNode.toggleVisibilityClass('test', false);

            expect('html').toHaveClass('test-hidden');
            expect('html').not.toHaveClass('test-shown');
        });
    });

    describe('setCssClass', () => {
        it('should add class to html node', () => {
            htmlNode.setCssClass('test-class', true);

            expect('html').toHaveClass('test-class');
        });

        it('should add multiple classes to html node', () => {
            htmlNode.setCssClass('test-class test-class2', true);

            expect('html').toHaveClass('test-class');
            expect('html').toHaveClass('test-class2');
        });

        it('should remove class from html node', () => {
            htmlNode.setCssClass('test-class', true);
            htmlNode.setCssClass('test-class', false);

            expect('html').not.toHaveClass('test-class');
        });

        it('should remove multiple class from html node', () => {
            htmlNode.setCssClass('test-class test-class2', true);
            htmlNode.setCssClass('test-class test-class2', false);

            expect('html').not.toHaveClass('test-class');
            expect('html').not.toHaveClass('test-class2');
        });

        it('should not add class if undefined class name', () => {
            htmlNode.setCssClass(<any>undefined, true);

            expect('html').toHaveAttr('class', '');
        });
    });

    describe('hasCssClass', () => {
        it('should return false if html node doesnt have specified class', () => {
            expect(htmlNode.hasCssClass('test-class')).toBeFalse();
        });

        it('should return true if html node has specified class', () => {
            doc.documentElement.classList.add('test-class');

            expect(htmlNode.hasCssClass('test-class')).toBeTrue();
        });
    });

    describe('setAttribute()', () => {
        it('should set specified attribute to specified value', () => {
            htmlNode.setAttribute('some-attr', 'val');

            expect('html').toHaveAttr('some-attr', 'val');
        });

        it('should unset specified attribute if value is empty', () => {
            htmlNode.setAttribute('some-attr', 'val');
            htmlNode.setAttribute('some-attr', null);

            expect('html').not.toHaveAttr('some-attr');
        });
    });

    describe('getAttribute()', () => {
        it('should return value of specified attribute', () => {
            doc.documentElement.setAttribute('some-attr', 'val');

            expect(htmlNode.getAttribute('some-attr')).toBe('val');
        });
    });
});

describe('HtmlNode.blockScrolling', () => {
    let windowMock: WindowMock;
    let htmlNode: HtmlNode;
    let htmlElem: HtmlElementMock;

    beforeEach(() => {
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                HtmlNode,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        htmlElem = windowMock.document.documentElement;
        htmlNode = TestBed.inject(HtmlNode);
    });

    it('should set a class and set top equal to -scrollY', () => {
        windowMock.scrollY = 50;

        htmlNode.blockScrolling(true);

        expect(windowMock.document.documentElement.classList.add).toHaveBeenCalledWith('cdk-global-scrollblock');
        expect(windowMock.document.documentElement.style.top).toBe('-50px');
    });

    it('should unset class and restore scroll when unblocking', () => {
        windowMock.document.documentElement.style.top = '-50px';

        htmlNode.blockScrolling(false);

        expect(windowMock.document.documentElement.classList.remove).toHaveBeenCalledWith('cdk-global-scrollblock');
        expect(windowMock.scrollTo).toHaveBeenCalledWith(0, 50);
    });

    describe('hasBlockScrolling()', () => {
        it('should return false if class is not set', () => {
            htmlElem.classList.contains.and.callFake((cssClass: string) => cssClass === 'cdk-global-scrollblock' && false);
            expect(htmlNode.hasBlockScrolling()).toBeFalse();
        });

        it('should return true if class is set', () => {
            htmlElem.classList.contains.and.callFake((cssClass: string) => cssClass === 'cdk-global-scrollblock' && true);
            expect(htmlNode.hasBlockScrolling()).toBeTrue();
        });
    });
});
