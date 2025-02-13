import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BaseRacingTemplateService } from './base-racing-template.service';

describe('BaseRacingTemplateService', () => {
    let service: BaseRacingTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(BaseRacingTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
