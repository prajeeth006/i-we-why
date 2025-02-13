import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeFirstGoalScorerComponent } from './dark-theme-first-goal-scorer.component';

describe('DarkThemeFirstGoalScorerComponent', () => {
    let component: DarkThemeFirstGoalScorerComponent;
    let fixture: ComponentFixture<DarkThemeFirstGoalScorerComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeFirstGoalScorerComponent],
        });
        fixture = TestBed.createComponent(DarkThemeFirstGoalScorerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
