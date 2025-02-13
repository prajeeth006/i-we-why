import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeFrameBettingComponent } from './dark-theme-frame-betting.component';

describe('DarkThemeFrameBettingComponent', () => {
    let component: DarkThemeFrameBettingComponent;
    let fixture: ComponentFixture<DarkThemeFrameBettingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeFrameBettingComponent],
        });
        fixture = TestBed.createComponent(DarkThemeFrameBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
