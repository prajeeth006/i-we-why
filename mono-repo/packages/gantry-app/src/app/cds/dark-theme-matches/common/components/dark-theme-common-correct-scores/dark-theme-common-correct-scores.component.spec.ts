import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeCommonCorrectScoreComponent } from './dark-theme-common-correct-scores.component';

describe('DarkThemeCommonCorrectScoreComponent', () => {
    let component: DarkThemeCommonCorrectScoreComponent;
    let fixture: ComponentFixture<DarkThemeCommonCorrectScoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeCommonCorrectScoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeCommonCorrectScoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
