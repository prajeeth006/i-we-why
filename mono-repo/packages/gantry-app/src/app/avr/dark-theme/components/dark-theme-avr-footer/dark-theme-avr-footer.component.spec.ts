import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeAvrFooterComponent } from './dark-theme-avr-footer.component';

describe('DarkThemeAvrFooterComponent', () => {
    let component: DarkThemeAvrFooterComponent;
    let fixture: ComponentFixture<DarkThemeAvrFooterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [DarkThemeAvrFooterComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeAvrFooterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
