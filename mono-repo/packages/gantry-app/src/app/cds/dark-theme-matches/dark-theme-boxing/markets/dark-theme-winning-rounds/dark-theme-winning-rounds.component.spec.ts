import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeWinningRoundsComponent } from './dark-theme-winning-rounds.component';

describe('DarkThemeWinningGroupOfRoundsComponent', () => {
    let component: DarkThemeWinningRoundsComponent;
    let fixture: ComponentFixture<DarkThemeWinningRoundsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeWinningRoundsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeWinningRoundsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
