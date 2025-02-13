import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TowinTheTossComponent } from './towin-the-toss.component';

describe('TowinTheTossComponent', () => {
  let component: TowinTheTossComponent;
  let fixture: ComponentFixture<TowinTheTossComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TowinTheTossComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TowinTheTossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
