import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeAvrPreambleHorseComponent } from './dark-theme-avr-preamble-horse.component';

describe('DarkThemeAvrPreambleHorseComponent', () => {
    let component: DarkThemeAvrPreambleHorseComponent;
    let fixture: ComponentFixture<DarkThemeAvrPreambleHorseComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [DarkThemeAvrPreambleHorseComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeAvrPreambleHorseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
