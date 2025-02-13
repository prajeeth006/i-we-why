import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHandicapComponent } from './match-handicap.component';

describe('MatchHandicapComponent', () => {
  let component: MatchHandicapComponent;
  let fixture: ComponentFixture<MatchHandicapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchHandicapComponent]
    });
    fixture = TestBed.createComponent(MatchHandicapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
