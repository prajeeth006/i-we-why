import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeCommonMarketRecordComponent } from './dark-theme-common-market-records.component';

describe('DarkThemeCommonMarketRecordComponent', () => {
    let component: DarkThemeCommonMarketRecordComponent;
    let fixture: ComponentFixture<DarkThemeCommonMarketRecordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeCommonMarketRecordComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeCommonMarketRecordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
