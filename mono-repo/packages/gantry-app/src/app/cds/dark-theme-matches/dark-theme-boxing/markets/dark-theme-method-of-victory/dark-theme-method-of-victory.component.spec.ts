import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeMethodOfVictoryComponent } from './dark-theme-method-of-victory.component';

describe('DarkThemeMethodOfVictoryComponent', () => {
    let component: DarkThemeMethodOfVictoryComponent;
    let fixture: ComponentFixture<DarkThemeMethodOfVictoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeMethodOfVictoryComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeMethodOfVictoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
