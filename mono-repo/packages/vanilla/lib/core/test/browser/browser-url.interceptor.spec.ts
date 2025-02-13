import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { browserUrlInterceptor } from '../../src/browser/browser-url.interceptor';
import { WindowMock } from '../../src/browser/window/test/window-ref.mock';
import { UrlServiceMock } from '../navigation/url.mock';

describe('BrowserUrlInterceptor', () => {
    let windowMock: WindowMock;
    let urlServiceMock: UrlServiceMock;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                provideHttpClient(withInterceptors([browserUrlInterceptor])),
                provideHttpClientTesting(),
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock.location.href = 'https://sports.bwin.com/some/page?q=1';
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should append current absolute URL to request as a header for same domain url', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('x-bwin-browser-url')).toEqual('https://sports.bwin.com/some/page?q=1');
        req.flush('');
    });

    it('should not append header for different domain url', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: false });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('x-bwin-browser-url')).toBeNull();
        req.flush('');
    });
});
