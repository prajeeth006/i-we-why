import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeAvrResultComponent } from './dark-theme-avr-result.component';

describe('DarkThemeAvrResultComponent', () => {
    let component: DarkThemeAvrResultComponent;
    let fixture: ComponentFixture<DarkThemeAvrResultComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeAvrResultComponent],
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeAvrResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
