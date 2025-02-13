import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GreyhoundRacingContentService } from './greyhound-racing-content.service';

describe('GreyhoundRacingContentService', () => {
    let service: GreyhoundRacingContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(GreyhoundRacingContentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
