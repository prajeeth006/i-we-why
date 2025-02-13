import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OutrightTv1Component } from './outright-tv1.component';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OutrightTv1Component', () => {
  let component: OutrightTv1Component;
  let fixture: ComponentFixture<OutrightTv1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [OutrightTv1Component],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(OutrightTv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
