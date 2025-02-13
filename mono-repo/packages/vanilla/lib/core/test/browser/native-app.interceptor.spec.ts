import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { nativeAppInterceptor } from '../../src/browser/native-app.interceptor';
import { PageMock } from '../browsercommon/page.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { UrlServiceMock } from '../navigation/url.mock';

describe('NativeAppInterceptor', () => {
    let page: PageMock;
    let urlServiceMock: UrlServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        page = MockContext.useMock(PageMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([nativeAppInterceptor])), provideHttpClientTesting()],
        });
        page.product = 'sports';
        nativeAppServiceMock.isNative = true;
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should append native app header', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.bwin.dev' });
        nativeAppServiceMock.applicationName = 'testNative';
        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-Native-App')).toEqual('testNative');
        req.flush('');
    });

    it('should not append header when url is external', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.party.pop' });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-Native-App')).toBeNull();
        req.flush('');
    });

    it('should not append header when not native', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.bwin.dev' });
        nativeAppServiceMock.isNative = false;

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-Native-App')).toBeNull();
        req.flush('');
    });
});
