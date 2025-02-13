import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../common/mocks/route-data-service.mock';
import {TennisComponent } from './tennis.component';

describe("TennisComponent",()=>{

  let component: TennisComponent;
  let fixture: ComponentFixture<TennisComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ TennisComponent ],
      providers: [ MockContext.providers ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TennisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create vm', () => {
    expect(component.vm$).toBeTruthy();
  });

});