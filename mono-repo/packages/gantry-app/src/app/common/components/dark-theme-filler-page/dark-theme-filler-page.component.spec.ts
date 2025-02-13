import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeFillerPageComponent } from './dark-theme-filler-page.component';

describe('DarkThemeFillerPageComponent', () => {
    let component: DarkThemeFillerPageComponent;
    let fixture: ComponentFixture<DarkThemeFillerPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeFillerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
