import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTouchdownScorerComponent } from './first-touchdown-scorer.component';

describe('FirstTouchdownScorerComponent', () => {
  let component: FirstTouchdownScorerComponent;
  let fixture: ComponentFixture<FirstTouchdownScorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstTouchdownScorerComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTouchdownScorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
