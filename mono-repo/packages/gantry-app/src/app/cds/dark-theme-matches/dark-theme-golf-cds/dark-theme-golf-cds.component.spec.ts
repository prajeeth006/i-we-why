import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeGolfCdsComponent } from './dark-theme-golf-cds.component';

describe('DarkThemeGolfCdsComponent', () => {
    let component: DarkThemeGolfCdsComponent;
    let fixture: ComponentFixture<DarkThemeGolfCdsComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeGolfCdsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeGolfCdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
