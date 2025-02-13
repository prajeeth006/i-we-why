import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RacingConfigurationService } from './racing-configuration.service';

describe('RacingConfigurationService', () => {
    let service: RacingConfigurationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(RacingConfigurationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
