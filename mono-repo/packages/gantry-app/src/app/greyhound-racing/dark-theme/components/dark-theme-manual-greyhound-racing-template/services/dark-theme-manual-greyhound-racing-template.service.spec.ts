import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeManualGreyhoundRacingTemplateService } from './dark-theme-manual-greyhound-racing-template.service';

describe('DarkThemeManualGreyhoundRacingTemplateService', () => {
    let service: DarkThemeManualGreyhoundRacingTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeManualGreyhoundRacingTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should format eachy way from "2 places 1/4 odds" to "1/4 ODDS 1-2"', () => {
        const result = service.setEachWay('2 places 1/4 odds');
        expect(result).toBe('1/4 ODDS 1-2');
    });
});
