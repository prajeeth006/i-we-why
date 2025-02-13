import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeTotalGoalsComponent } from './dark-theme-total-goals.component';

describe('DarkThemeTotalGoalsComponent', () => {
    let component: DarkThemeTotalGoalsComponent;
    let fixture: ComponentFixture<DarkThemeTotalGoalsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeTotalGoalsComponent],
        });
        fixture = TestBed.createComponent(DarkThemeTotalGoalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
