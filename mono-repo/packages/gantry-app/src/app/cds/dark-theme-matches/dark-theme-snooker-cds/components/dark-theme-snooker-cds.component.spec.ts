import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeSnookerCdsComponent } from './dark-theme-snooker-cds.component';

describe('DarkThemeSnookerCdsComponent', () => {
    let component: DarkThemeSnookerCdsComponent;
    let fixture: ComponentFixture<DarkThemeSnookerCdsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeSnookerCdsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeSnookerCdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
