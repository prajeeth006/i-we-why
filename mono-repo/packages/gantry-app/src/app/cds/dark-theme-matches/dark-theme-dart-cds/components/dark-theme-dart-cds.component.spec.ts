import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeDartCdsComponent } from './dark-theme-dart-cds.component';

describe('DarkThemeDartCdsComponent', () => {
    let component: DarkThemeDartCdsComponent;
    let fixture: ComponentFixture<DarkThemeDartCdsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeDartCdsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeDartCdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
