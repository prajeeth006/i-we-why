import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { DarkThemeOutrightTv2Component } from './dark-theme-outright-tv2.component';

describe('DarkThemeOutrightTv2Component', () => {
    let component: DarkThemeOutrightTv2Component;
    let fixture: ComponentFixture<DarkThemeOutrightTv2Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeOutrightTv2Component],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeOutrightTv2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
