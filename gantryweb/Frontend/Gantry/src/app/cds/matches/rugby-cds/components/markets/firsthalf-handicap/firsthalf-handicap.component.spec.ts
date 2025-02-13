import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirsthalfHandicapComponent } from './firsthalf-handicap.component';

describe('FirsthalfHandicapComponent', () => {
  let component: FirsthalfHandicapComponent;
  let fixture: ComponentFixture<FirsthalfHandicapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirsthalfHandicapComponent]
    });
    fixture = TestBed.createComponent(FirsthalfHandicapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
