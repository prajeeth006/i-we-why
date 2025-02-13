import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeIndividualRoundBettingComponent } from './dark-theme-individual-round-betting.component';

describe('DarkThemeIndividualRoundBettingComponent', () => {
    let component: DarkThemeIndividualRoundBettingComponent;
    let fixture: ComponentFixture<DarkThemeIndividualRoundBettingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeIndividualRoundBettingComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeIndividualRoundBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
