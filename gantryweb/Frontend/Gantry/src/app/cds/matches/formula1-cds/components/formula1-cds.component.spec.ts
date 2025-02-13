import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Formula1CdsComponent } from './formula1-cds.component';
import { MockContext } from 'moxxi';
 import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
 import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { SportEventDateFormatPipe } from '../../../../common/pipes/sport-event-datetime-format.pipe';

describe('Formula1CdsComponent', () => {
  let component: Formula1CdsComponent;
  let fixture: ComponentFixture<Formula1CdsComponent>;


  beforeEach(async () => {
     MockContext.useMock(RouteDataServiceMock);
     MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [Formula1CdsComponent,SportEventDateFormatPipe],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(Formula1CdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});