import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { appContextInterceptor } from '../../src/browser/app-context.interceptor';
import { PageMock } from '../browsercommon/page.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { UrlServiceMock } from '../navigation/url.mock';

describe('AppContextInterceptor', () => {
    let page: PageMock;
    let urlServiceMock: UrlServiceMock;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        page = MockContext.useMock(PageMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([appContextInterceptor])), provideHttpClientTesting()],
        });
        page.product = 'sports';
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should append app context header', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.bwin.dev' });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-App-Context')).toEqual('default');
        req.flush('');
    });

    it('should not append header when url is external', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.party.pop' });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-App-Context')).toBeNull();
        req.flush('');
    });
});
