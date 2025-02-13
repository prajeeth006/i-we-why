import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeCorrectScoreComponent } from './dark-theme-correct-score.component';

describe('DarkThemeCorrectScoreComponent', () => {
    let component: DarkThemeCorrectScoreComponent;
    let fixture: ComponentFixture<DarkThemeCorrectScoreComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeCorrectScoreComponent],
        });
        fixture = TestBed.createComponent(DarkThemeCorrectScoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
