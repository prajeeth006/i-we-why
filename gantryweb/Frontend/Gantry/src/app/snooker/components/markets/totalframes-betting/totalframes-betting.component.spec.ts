import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalframesBettingComponent } from './totalframes-betting.component';

describe('TotalframesBettingComponent', () => {
  let component: TotalframesBettingComponent;
  let fixture: ComponentFixture<TotalframesBettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalframesBettingComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalframesBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
