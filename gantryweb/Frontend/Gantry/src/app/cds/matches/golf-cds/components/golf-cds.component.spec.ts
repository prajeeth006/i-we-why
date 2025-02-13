import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfCdsComponent } from './golf-cds.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('GolfCdsComponent', () => {
  let component: GolfCdsComponent;
  let fixture: ComponentFixture<GolfCdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RouterTestingModule],
      declarations: [GolfCdsComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(GolfCdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
