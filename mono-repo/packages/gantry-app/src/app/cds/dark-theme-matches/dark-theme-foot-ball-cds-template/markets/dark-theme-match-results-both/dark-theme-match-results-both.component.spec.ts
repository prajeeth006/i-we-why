import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeMatchResultsBothComponent } from './dark-theme-match-results-both.component';

describe('MatchResultsComponent', () => {
    let component: DarkThemeMatchResultsBothComponent;
    let fixture: ComponentFixture<DarkThemeMatchResultsBothComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeMatchResultsBothComponent],
        });
        fixture = TestBed.createComponent(DarkThemeMatchResultsBothComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
