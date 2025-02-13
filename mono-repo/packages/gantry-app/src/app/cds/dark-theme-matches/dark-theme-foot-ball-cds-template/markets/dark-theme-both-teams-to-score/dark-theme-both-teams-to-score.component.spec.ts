import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeBothTeamsToScoreComponent } from './dark-theme-both-teams-to-score.component';

describe('DarkThemeBothTeamsToScoreComponent', () => {
    let component: DarkThemeBothTeamsToScoreComponent;
    let fixture: ComponentFixture<DarkThemeBothTeamsToScoreComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeBothTeamsToScoreComponent],
        });
        fixture = TestBed.createComponent(DarkThemeBothTeamsToScoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
