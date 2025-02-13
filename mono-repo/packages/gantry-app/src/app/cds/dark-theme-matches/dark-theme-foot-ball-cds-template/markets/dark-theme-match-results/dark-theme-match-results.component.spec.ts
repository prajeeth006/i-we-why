import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeMatchResultsComponent } from './dark-theme-match-results.component';

describe('DarkThemeMatchResultsComponent', () => {
    let component: DarkThemeMatchResultsComponent;
    let fixture: ComponentFixture<DarkThemeMatchResultsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeMatchResultsComponent],
        });
        fixture = TestBed.createComponent(DarkThemeMatchResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
