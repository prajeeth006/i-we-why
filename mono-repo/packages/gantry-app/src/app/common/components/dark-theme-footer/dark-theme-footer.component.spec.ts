import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DarkThemeFooterComponent } from './dark-theme-footer.component';

describe('DarkThemeFooterComponent', () => {
    let component: DarkThemeFooterComponent;
    let fixture: ComponentFixture<DarkThemeFooterComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeFooterComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
