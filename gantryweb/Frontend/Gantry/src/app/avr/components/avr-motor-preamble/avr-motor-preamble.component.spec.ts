import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvrMotorPreambleComponent } from './avr-motor-preamble.component';

describe('AvrMotorPreambleComponent', () => {
  let component: AvrMotorPreambleComponent;
  let fixture: ComponentFixture<AvrMotorPreambleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvrMotorPreambleComponent]
    });
    fixture = TestBed.createComponent(AvrMotorPreambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
