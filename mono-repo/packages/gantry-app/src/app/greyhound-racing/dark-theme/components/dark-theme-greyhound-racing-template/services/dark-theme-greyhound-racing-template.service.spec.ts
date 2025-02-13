import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeGreyhoundRacingTemplateService } from './dark-theme-greyhound-racing-template.service';

describe('DarkThemeGreyhoundRacingTemplateService', () => {
    let service: DarkThemeGreyhoundRacingTemplateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeGreyhoundRacingTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
