import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeFooterFullComponent } from './dark-theme-footer-full.component';

describe('DarkThemeFooterFullComponent', () => {
    let component: DarkThemeFooterFullComponent;
    let fixture: ComponentFixture<DarkThemeFooterFullComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeFooterFullComponent],
        });
        fixture = TestBed.createComponent(DarkThemeFooterFullComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
