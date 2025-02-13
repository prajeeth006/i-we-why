import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { deviceTypeInterceptor } from '../../src/browser/device-type.interceptor';
import { PageMock } from '../browsercommon/page.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { UrlServiceMock } from '../navigation/url.mock';
import { DeviceServiceMock } from './device.mock';

describe('DeviceTypeInterceptor', () => {
    let urlServiceMock: UrlServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        MockContext.useMock(PageMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(NativeAppServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([deviceTypeInterceptor])), provideHttpClientTesting()],
        });
        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should append device type header', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.bwin.dev' });
        deviceServiceMock.deviceType = 'phone';
        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-Device-Type')).toEqual('phone');
        req.flush('');
    });

    it('should not append header when url is external', () => {
        urlServiceMock.parse.withArgs('url').and.returnValue({ isSameTopDomain: true, hostname: 'test.party.pop' });

        client.get('url', { responseType: 'text' }).subscribe();
        const req = controller.expectOne('url');
        expect(req.request.headers.get('X-Device-Type')).toBeNull();
        req.flush('');
    });
});
