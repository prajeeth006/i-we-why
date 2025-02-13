import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeTotalPointsComponent } from './dark-theme-total-points.component';

describe('DarkThemeTotalPointsComponent', () => {
    let component: DarkThemeTotalPointsComponent;
    let fixture: ComponentFixture<DarkThemeTotalPointsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeTotalPointsComponent],
        });
        fixture = TestBed.createComponent(DarkThemeTotalPointsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
