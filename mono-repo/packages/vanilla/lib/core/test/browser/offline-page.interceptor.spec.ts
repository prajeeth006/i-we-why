import { HttpClient, HttpErrorResponse, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';

import { offlinePageInterceptor } from '../../src/browser/offline-page.interceptor';
import { WindowMock } from '../../src/browser/window/test/window-ref.mock';

describe('OfflinePageInterceptor', () => {
    let windowMock: WindowMock;
    let response: Partial<HttpErrorResponse>;
    let client: HttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([offlinePageInterceptor])),
                provideHttpClientTesting(),
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        response = {
            status: 503,
            statusText: 'ERROR',
            headers: new HttpHeaders().set('X-Offline-Page', '1'),
        };

        client = TestBed.inject(HttpClient);
        controller = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it('should reload page when status code 503 and offline header is present', () => {
        interceptError(response);

        expect(windowMock.location.reload).toHaveBeenCalled();
    });

    it('should not reload page when status code is not 503', () => {
        interceptError({
            ...response,
            status: 500,
        });

        expect(windowMock.location.reload).not.toHaveBeenCalled();
    });

    it('should not reload page when offline header is not present', () => {
        interceptError({
            ...response,
            headers: new HttpHeaders().set('X-Offline', '1'),
        });

        expect(windowMock.location.reload).not.toHaveBeenCalled();
    });

    function interceptError(response: Partial<HttpErrorResponse>) {
        client.get('url').subscribe();
        const req = controller.expectOne('url');
        req.flush('Invalid request parameters', response);
    }
});
