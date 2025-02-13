import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GantryCommonContentService } from './gantry-common-content.service';

describe('GantryCommonContentService', () => {
    let service: GantryCommonContentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(GantryCommonContentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
