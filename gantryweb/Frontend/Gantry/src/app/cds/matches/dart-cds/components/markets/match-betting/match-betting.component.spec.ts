import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchBettingComponent } from './match-betting.component';

describe('MatchBettingComponent', () => {
  let component: MatchBettingComponent;
  let fixture: ComponentFixture<MatchBettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchBettingComponent]
    });
    fixture = TestBed.createComponent(MatchBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
