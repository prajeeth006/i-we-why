import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstGoalscorerComponent } from './first-goalscorer.component';

describe('FirstGoalscorerComponent', () => {
  let component: FirstGoalscorerComponent;
  let fixture: ComponentFixture<FirstGoalscorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstGoalscorerComponent]
    });
    fixture = TestBed.createComponent(FirstGoalscorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
