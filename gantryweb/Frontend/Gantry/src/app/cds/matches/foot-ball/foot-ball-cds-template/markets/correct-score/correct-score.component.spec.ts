import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectScoreComponent } from './correct-score.component';

describe('CorrectScoreComponent', () => {
  let component: CorrectScoreComponent;
  let fixture: ComponentFixture<CorrectScoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorrectScoreComponent]
    });
    fixture = TestBed.createComponent(CorrectScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
