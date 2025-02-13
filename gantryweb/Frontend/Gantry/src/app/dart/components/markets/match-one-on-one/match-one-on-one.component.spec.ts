import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOneOnOneComponent } from './match-one-on-one.component';

describe('MatchOneOnOneComponent', () => {
  let component: MatchOneOnOneComponent;
  let fixture: ComponentFixture<MatchOneOnOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchOneOnOneComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchOneOnOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
