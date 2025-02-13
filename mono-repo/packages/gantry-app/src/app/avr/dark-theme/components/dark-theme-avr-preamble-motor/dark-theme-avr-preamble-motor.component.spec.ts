import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeAvrPreambleMotorComponent } from './dark-theme-avr-preamble-motor.component';

describe('DarkThemeAvrPreambleMotorComponent', () => {
    let component: DarkThemeAvrPreambleMotorComponent;
    let fixture: ComponentFixture<DarkThemeAvrPreambleMotorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [DarkThemeAvrPreambleMotorComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeAvrPreambleMotorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
