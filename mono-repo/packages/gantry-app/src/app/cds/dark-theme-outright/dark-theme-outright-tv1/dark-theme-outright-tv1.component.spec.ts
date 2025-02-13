import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeOutrightTv1Component } from './dark-theme-outright-tv1.component';

describe('DarkThemeOutrightTv1Component', () => {
    let component: DarkThemeOutrightTv1Component;
    let fixture: ComponentFixture<DarkThemeOutrightTv1Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeOutrightTv1Component],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeOutrightTv1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
