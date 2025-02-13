import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandicapBettingComponent } from './handicap-betting.component';

describe('HandicapBettingComponent', () => {
  let component: HandicapBettingComponent;
  let fixture: ComponentFixture<HandicapBettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HandicapBettingComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HandicapBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
