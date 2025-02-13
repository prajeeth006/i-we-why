import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeEachWayComponent } from './dark-theme-each-way.component';

describe('DarkThemeEachWayComponent', () => {
    let component: DarkThemeEachWayComponent;
    let fixture: ComponentFixture<DarkThemeEachWayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeEachWayComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeEachWayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
