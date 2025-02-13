import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeAvrPreambleDogComponent } from './dark-theme-avr-preamble-dog.component';

describe('DarkThemeAvrPreambleDogComponent', () => {
    let component: DarkThemeAvrPreambleDogComponent;
    let fixture: ComponentFixture<DarkThemeAvrPreambleDogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [DarkThemeAvrPreambleDogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeAvrPreambleDogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
