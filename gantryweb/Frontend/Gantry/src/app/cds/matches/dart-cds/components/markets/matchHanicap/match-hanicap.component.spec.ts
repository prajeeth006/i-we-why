import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHanicapComponent } from './match-hanicap.component';

describe('MatchHanicapComponent', () => {
  let component: MatchHanicapComponent;
  let fixture: ComponentFixture<MatchHanicapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchHanicapComponent]
    });
    fixture = TestBed.createComponent(MatchHanicapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
