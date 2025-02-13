import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeManualEachWayComponent } from './dark-theme-manual-each-way.component';

describe('DarkThemeManualEachWayComponent', () => {
    let component: DarkThemeManualEachWayComponent;
    let fixture: ComponentFixture<DarkThemeManualEachWayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeManualEachWayComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeManualEachWayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
