import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DefaultImageService } from './default-image.service';

describe('DefaultImageService', () => {
    let service: DefaultImageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DefaultImageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
