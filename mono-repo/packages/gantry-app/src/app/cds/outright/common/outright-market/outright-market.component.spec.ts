import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutrightMarketComponent } from './outright-market.component';

describe('OutrightMarketComponent', () => {
    let component: OutrightMarketComponent;
    let fixture: ComponentFixture<OutrightMarketComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OutrightMarketComponent],
        });
        fixture = TestBed.createComponent(OutrightMarketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
