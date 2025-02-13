import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DataFeedAuthenticationService } from './data-feed-authentication.service';

describe('DataFeedAuthenticationService', () => {
    let service: DataFeedAuthenticationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DataFeedAuthenticationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
