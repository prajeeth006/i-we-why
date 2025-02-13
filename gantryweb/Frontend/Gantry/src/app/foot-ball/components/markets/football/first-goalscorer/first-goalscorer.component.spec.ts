import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstGoalscorerComponent } from './first-goalscorer.component';

describe('FirstGoalscorerComponent', () => {
  let component: FirstGoalscorerComponent;
  let fixture: ComponentFixture<FirstGoalscorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstGoalscorerComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstGoalscorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
