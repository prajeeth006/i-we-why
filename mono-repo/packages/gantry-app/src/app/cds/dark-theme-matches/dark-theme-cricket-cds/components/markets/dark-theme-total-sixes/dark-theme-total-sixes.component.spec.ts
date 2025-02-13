import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeTotalSixesComponent } from './dark-theme-total-sixes.component';

describe('DarkThemeTotalSixesComponent', () => {
    let component: DarkThemeTotalSixesComponent;
    let fixture: ComponentFixture<DarkThemeTotalSixesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeTotalSixesComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeTotalSixesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
