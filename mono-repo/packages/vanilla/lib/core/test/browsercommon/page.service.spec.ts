import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { PageService } from '@frontend/vanilla/core';

describe('PageService', () => {
    let pageService: PageService;
    let doc: Document;

    beforeAll(() => {
        TestBed.configureTestingModule({
            providers: [PageService],
        });
        pageService = TestBed.inject(PageService);
        doc = TestBed.inject(DOCUMENT);
    });

    describe('setTitle()', () => {
        it('should set title and set it back when revert is called', () => {
            const originalTitle = doc.title;
            const change = pageService.setTitle('test title');

            expect(doc.title).toBe('test title');

            change.revert();

            expect(doc.title).toBe(originalTitle);
        });

        it('should throw if revert() called multiple times', () => {
            const change = pageService.setTitle('test title');
            change.revert();

            expect(() => change.revert()) // act
                .toThrowError('Page title "test title" was already reverted.');
        });
    });

    describe('setMeta()', () => {
        let testRunnerMetaNames: string[] = [];

        beforeAll(() => {
            testRunnerMetaNames = Array.from(doc.querySelectorAll('meta')).map((t) => t.getAttribute('name')!);
        });

        afterEach(() =>
            Array.from(doc.querySelectorAll('meta'))
                .filter((t) => testRunnerMetaNames.indexOf(t.getAttribute('name')!) < 0)
                .forEach((t) => t.remove()),
        );

        it('should add meta tag to DOM and remove it when revert is called', () => {
            const change = pageService.setMeta('test', 'meta text'); // act: set

            const meta = getMetaElement('test')!;
            expect(meta.content).toBe('meta text');

            change.revert(); // act: revert

            expect(getMetaElement('test')).toBeNull();
        });

        it('should encode me tag name correctly', () => {
            pageService.setMeta('wild " \\ name', 'meta text'); // act

            const meta = getMetaElement('"wild \\" \\\\ name"')!;
            expect(meta.content).toBe('meta text');
        });

        it('should set content of exiting meta tag and restore its value when revert is called', () => {
            createMetaTag('test', 'original');

            const change = pageService.setMeta('test', 'changed'); // act: set

            expect(getMetaElement('test')!.content).toBe('changed');

            change.revert(); // act: revert

            expect(getMetaElement('test')!.content).toBe('original');
        });

        it('should remove tag if specified content is null', () => {
            createMetaTag('test', 'original');

            const change = pageService.setMeta('test', null); // act: set

            expect(getMetaElement('test')).toBeNull();

            change.revert(); // act: revert

            expect(getMetaElement('test')!.content).toBe('original');
        });

        it('should throw if revert() called multiple times', () => {
            const change = pageService.setMeta('test', 'meta text');
            change.revert();

            expect(() => change.revert()) // act
                .toThrowError('The change of meta tag "test" to content "meta text" was already reverted.');
        });

        function createMetaTag(name: string, content: string) {
            const meta = doc.createElement('meta');
            meta.name = name;
            meta.content = content;
            doc.head.appendChild(meta);
        }

        function getMetaElement(nameSelector: string): HTMLMetaElement | null {
            return doc.querySelector(`meta[name=${nameSelector}]`);
        }
    });
});
