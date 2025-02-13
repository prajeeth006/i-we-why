import { DOCUMENT } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { StylesService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { LoggerMock } from '../languages/logger.mock';

describe('StyleService', () => {
    let service: StylesService;
    let loggerMock: LoggerMock;
    let link: HtmlElementMock;
    let documentMock: any;

    beforeEach(() => {
        loggerMock = MockContext.useMock(LoggerMock);
        link = new HtmlElementMock();
        documentMock = {
            createElement: jasmine.createSpy('createElement').and.returnValue(link),
            head: {
                appendChild: jasmine.createSpy('appendChild'),
            },
            body: {
                appendChild: jasmine.createSpy('appendChild'),
            },
        };

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                StylesService,
                {
                    provide: DOCUMENT,
                    useValue: documentMock,
                },
            ],
        });

        service = TestBed.inject(StylesService);
    });

    describe('load()', () => {
        beforeEach(() => {
            spyOn(service, `stylesInitialized`).and.returnValue(of(true));
            service.init([
                { url: '/x/style1', lazyLoad: 'Secondary' },
                { url: '/x/style2', lazyLoad: 'Secondary', alias: 's2' },
                { url: '/x/style3', lazyLoad: 'Secondary', media: 'sm' },
                { url: '/x/style4', lazyLoad: 'Secondary', media: 'screen' },
            ]);
        });

        it('should add link tag to dom', fakeAsync(() => {
            service.load('/x/style1');
            tick();
            verifyStyleAdded('/x/style1');
        }));

        it('should resolve href from alias', fakeAsync(() => {
            service.load('s2');
            tick();
            verifyStyleAdded('/x/style2');
        }));

        it('should resolve media query from alias', fakeAsync(() => {
            service.load('/x/style3');
            tick();
            verifyStyleAdded('/x/style3', 'screen and (min-width: 600px) and (max-width: 959px)');
        }));

        it('should add media query if its not an alias', fakeAsync(() => {
            service.load('/x/style4');
            tick();
            verifyStyleAdded('/x/style4', 'screen');
        }));

        it('should throw an error if style is not known', fakeAsync(() => {
            const spy = jasmine.createSpy();

            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            service.load('x').catch(spy);
            tick();

            expect(spy).toHaveBeenCalled();
        }));

        it('should resolve the promise when the style is loaded', fakeAsync(() => {
            const spy = jasmine.createSpy();

            service.load('/x/style1').then(spy);
            tick();
            verifyStyleAdded('/x/style1');
            link.addEventListener.calls
                .all()
                .find((c) => c.args[0] === 'load')!
                .args[1]();
            tick();

            expect(spy).toHaveBeenCalled();
        }));

        it('should log when the style is loaded with an error', fakeAsync(() => {
            const spy = jasmine.createSpy();

            service.load('/x/style1').then(spy);
            tick();
            verifyStyleAdded('/x/style1');
            link.addEventListener.calls
                .all()
                .find((c) => c.args[0] === 'error')!
                .args[1]();
            tick();

            expect(spy).toHaveBeenCalled();
            expect(loggerMock.error).toHaveBeenCalled();
        }));

        it('should only add the same style once', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');
            const spy2 = jasmine.createSpy('spy2');

            service.load('/x/style2').then(spy);
            service.load('s2').then(spy2);
            tick();
            verifyStyleAdded('/x/style2');

            expect(documentMock.head.appendChild).toHaveBeenCalledTimes(1);
            link.addEventListener.calls
                .all()
                .find((c) => c.args[0] === 'load')!
                .args[1]();
            tick();

            expect(spy).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        }));
    });

    describe('add()', () => {
        it('should add style to dom', () => {
            service.add('my-id', 'nektar');
            const bodySpy = documentMock.body.appendChild;
            expect(bodySpy).toHaveBeenCalledTimes(1);
            const calledWith = bodySpy.calls.mostRecent().args[0] as HTMLStyleElement;
            expect(calledWith.id).toBe('my-id');
            expect(calledWith.innerHTML).toBe('nektar');
        });
    });

    function verifyStyleAdded(href: string, media?: string) {
        expect(documentMock.createElement).toHaveBeenCalledWith('link');
        expect(documentMock.head.appendChild).toHaveBeenCalledWith(link);
        expect(link.href).toBe(href);
        expect(link.media).toBe(media!);
        expect(link.rel).toBe('stylesheet');
        expect(link.type).toBe('text/css');
    }
});
