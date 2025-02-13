import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeHeaderFullComponent } from './dark-theme-header-full.component';

describe('DarkThemeHeaderFullComponent', () => {
    let component: DarkThemeHeaderFullComponent;
    let fixture: ComponentFixture<DarkThemeHeaderFullComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeHeaderFullComponent],
        });
        fixture = TestBed.createComponent(DarkThemeHeaderFullComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
