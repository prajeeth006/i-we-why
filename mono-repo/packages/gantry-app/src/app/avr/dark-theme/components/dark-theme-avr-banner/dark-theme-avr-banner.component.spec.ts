import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeAvrBannerComponent } from './dark-theme-avr-banner.component';

describe('DarkThemeAvrBannerComponent', () => {
    let component: DarkThemeAvrBannerComponent;
    let fixture: ComponentFixture<DarkThemeAvrBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [DarkThemeAvrBannerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeAvrBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
