import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeManualGreyhoundRacingTemplateComponent } from './dark-theme-manual-greyhound-racing-template.component';

describe('DarkThemeManualGreyhoundRacingTemplateComponent', () => {
    let component: DarkThemeManualGreyhoundRacingTemplateComponent;
    let fixture: ComponentFixture<DarkThemeManualGreyhoundRacingTemplateComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeManualGreyhoundRacingTemplateComponent],
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeManualGreyhoundRacingTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
