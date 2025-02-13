import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnookerCdsComponent } from './snooker-cds.component';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SnookerCdsComponent', () => {
  let component: SnookerCdsComponent;
  let fixture: ComponentFixture<SnookerCdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SnookerCdsComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SnookerCdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
