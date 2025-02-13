import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeTotalframesBettingComponent } from './dark-theme-totalframes-betting.component';

describe('DarkThemeTotalframesBettingComponent', () => {
    let component: DarkThemeTotalframesBettingComponent;
    let fixture: ComponentFixture<DarkThemeTotalframesBettingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeTotalframesBettingComponent],
        });
        fixture = TestBed.createComponent(DarkThemeTotalframesBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
