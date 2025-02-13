import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDrawAwayComponent } from './home-draw-away.component';;
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteDataServiceMock } from '../../../../../common/mocks/route-data-service.mock';
import { EventFeedUrlServiceMock } from '../../../../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../../../../common/mocks/activated-route.mock';

describe('HomeDrawAwayComponent', () => {
  let component: HomeDrawAwayComponent;
  let fixture: ComponentFixture<HomeDrawAwayComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [HomeDrawAwayComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeDrawAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
   });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
