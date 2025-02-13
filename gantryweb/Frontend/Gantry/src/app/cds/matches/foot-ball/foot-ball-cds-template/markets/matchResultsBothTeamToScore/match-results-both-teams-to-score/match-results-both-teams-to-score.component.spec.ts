import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultsBothTeamsToScoreComponent } from './match-results-both-teams-to-score.component';

describe('MatchResultsBothTeamsToScoreComponent', () => {
  let component: MatchResultsBothTeamsToScoreComponent;
  let fixture: ComponentFixture<MatchResultsBothTeamsToScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchResultsBothTeamsToScoreComponent]
    });
    fixture = TestBed.createComponent(MatchResultsBothTeamsToScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
