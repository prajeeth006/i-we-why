import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeManualResultsComponent } from './dark-theme-manual-results.component';

describe('DarkThemeManualResultsComponent', () => {
    let component: DarkThemeManualResultsComponent;
    let fixture: ComponentFixture<DarkThemeManualResultsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeManualResultsComponent],
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeManualResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
