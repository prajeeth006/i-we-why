import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeToscoreInfirststInnsComponent } from './dark-theme-toscore-infirstst-inns.component';

describe('DarkThemeToscoreInfirststInnsComponent', () => {
    let component: DarkThemeToscoreInfirststInnsComponent;
    let fixture: ComponentFixture<DarkThemeToscoreInfirststInnsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeToscoreInfirststInnsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeToscoreInfirststInnsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
