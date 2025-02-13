import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OutrightTv2Component } from './outright-tv2.component';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OutrightTv2Component', () => {
  let component: OutrightTv2Component;
  let fixture: ComponentFixture<OutrightTv2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [OutrightTv2Component],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(OutrightTv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
