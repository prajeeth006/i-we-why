import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
    let service: ErrorHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(ErrorHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
