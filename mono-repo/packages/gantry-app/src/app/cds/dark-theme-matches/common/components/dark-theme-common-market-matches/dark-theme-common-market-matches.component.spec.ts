import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeCommonMarketComponent } from './dark-theme-common-market-matches.component';

describe('DarkThemeCommonMarketComponent', () => {
    let component: DarkThemeCommonMarketComponent;
    let fixture: ComponentFixture<DarkThemeCommonMarketComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeCommonMarketComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeCommonMarketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
