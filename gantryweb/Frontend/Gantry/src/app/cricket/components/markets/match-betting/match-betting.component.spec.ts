import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchBettingComponent } from './match-betting.component';

describe('MatchBettingComponent', () => {
  let component: MatchBettingComponent;
  let fixture: ComponentFixture<MatchBettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchBettingComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
