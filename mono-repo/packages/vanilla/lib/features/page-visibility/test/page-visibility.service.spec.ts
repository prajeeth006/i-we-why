import { DOCUMENT } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PageVisibilityService } from '@frontend/vanilla/features/page-visibility';

describe('PageVisibilityService', () => {
    let service: PageVisibilityService;
    let doc: Document;
    let addEventListenerSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DOCUMENT, useFactory: documentMockFactory }],
        });
        doc = TestBed.inject(DOCUMENT);
        addEventListenerSpy = spyOn(doc, 'addEventListener');
    });

    it('should add event listener for opera', () => {
        spyOnProperty(doc, 'hidden', 'get').and.returnValue('hidden');
        service = TestBed.inject(PageVisibilityService);
        expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', jasmine.any(Function), false);
    });

    it('should add event listener for webkitHidden', () => {
        spyOnProperty(<any>doc, 'webkitHidden', 'get').and.returnValue('webkitHidden');
        service = TestBed.inject(PageVisibilityService);
        expect(addEventListenerSpy).toHaveBeenCalledWith('webkitvisibilitychange', jasmine.any(Function), false);
    });

    it('should add event listener for webkitHidden 2', () => {
        spyOnProperty(<any>doc, 'msHidden', 'get').and.returnValue('msHidden');

        service = TestBed.inject(PageVisibilityService);
        expect(addEventListenerSpy).toHaveBeenCalledWith('msvisibilitychange', jasmine.any(Function), false);
    });

    it('should launch event PageVisibilityChange', fakeAsync(() => {
        let eventListenerCallback: any;

        spyOnProperty(<any>doc, 'msHidden', 'get').and.returnValue(false);
        addEventListenerSpy.and.callFake((key: any, func: any) => {
            eventListenerCallback = func;
        });

        let status: { isVisible: boolean };

        service = TestBed.inject(PageVisibilityService);
        service.visibilityChange().subscribe((val) => (status = val));

        eventListenerCallback();
        tick(150);

        expect(status!.isVisible).toBe(true);
    }));
});

const documentMockFactory = () => ({
    addEventListener: () => {},
    get hidden() {
        return undefined;
    },
    get webkitHidden() {
        return undefined;
    },
    get msHidden() {
        return undefined;
    },
});
