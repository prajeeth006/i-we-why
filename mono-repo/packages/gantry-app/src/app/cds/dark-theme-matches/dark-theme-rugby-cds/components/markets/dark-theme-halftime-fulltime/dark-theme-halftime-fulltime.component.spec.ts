import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeHalftimeFulltimeComponent } from './dark-theme-halftime-fulltime.component';

describe('DarkThemeHalftimeFulltimeComponent', () => {
    let component: DarkThemeHalftimeFulltimeComponent;
    let fixture: ComponentFixture<DarkThemeHalftimeFulltimeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeHalftimeFulltimeComponent],
        });
        fixture = TestBed.createComponent(DarkThemeHalftimeFulltimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
