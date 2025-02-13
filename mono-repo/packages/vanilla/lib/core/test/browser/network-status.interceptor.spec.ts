import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { networkStatusInterceptor } from '../../src/browser/network-status.interceptor';
import { NetworkServiceMock } from './network.mock';

describe('NetworkStatusInterceptor', () => {
    let networkServiceMock: NetworkServiceMock;
    let response: any;
    let request: HttpRequest<any>;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        networkServiceMock = MockContext.useMock(NetworkServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, provideHttpClient(withInterceptors([networkStatusInterceptor])), provideHttpClientTesting()],
        });

        request = new HttpRequest('GET', 'url', {});

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should report online', () => {
        intercept();

        expect(networkServiceMock.reportOnlineRequest).toHaveBeenCalled();
    });

    it('should report online for errors that are not related to network', () => {
        response = { status: 500, statusText: 'ERROR' };

        interceptError();

        expect(networkServiceMock.reportOnlineRequest).toHaveBeenCalled();
    });

    it('should report offline for error that are related to network', () => {
        response = { status: 0, statusText: 'ERROR' };

        interceptError();

        expect(networkServiceMock.reportOfflineRequest).toHaveBeenCalled();
    });

    function intercept() {
        client.request(request).subscribe();
        const req = controller.expectOne('url');
        req.flush('');
    }

    function interceptError() {
        client.request(request).subscribe();
        const req = controller.expectOne('url');
        const data = 'Invalid request parameters';
        req.flush(data, response);
    }
});
