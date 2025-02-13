import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalgoalsinthematchComponent } from './totalgoalsinthematch.component';

describe('TotalgoalsinthemarketComponent', () => {
  let component: TotalgoalsinthematchComponent;
  let fixture: ComponentFixture<TotalgoalsinthematchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalgoalsinthematchComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalgoalsinthematchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
