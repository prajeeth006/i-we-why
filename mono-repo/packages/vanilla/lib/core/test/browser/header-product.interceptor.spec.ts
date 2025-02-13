import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { headerProductInterceptor } from '../../src/browser/header-product.interceptor';
import { PageMock } from '../browsercommon/page.mock';
import { UrlServiceMock } from '../navigation/url.mock';

describe('HeaderProductInterceptor', () => {
    let page: PageMock;
    let urlServiceMock: UrlServiceMock;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        page = MockContext.useMock(PageMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([headerProductInterceptor])), provideHttpClientTesting()],
        });

        page.product = 'sports';
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should append product header', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.bwin.dev' });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-From-Product')).toEqual('sports');
        req.flush('');
    });

    it('should not append product header when url is external', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.party.pop' });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-From-Product')).toBeNull();
        req.flush('');
    });
});
