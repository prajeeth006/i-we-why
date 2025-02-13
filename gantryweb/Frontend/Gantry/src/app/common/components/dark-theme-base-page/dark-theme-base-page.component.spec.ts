import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeBasePageComponent } from './dark-theme-base-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../mocks/route-data-service.mock';

describe('DarkThemeBasePageComponent', () => {
  let component: DarkThemeBasePageComponent;
  let fixture: ComponentFixture<DarkThemeBasePageComponent>;

  beforeEach(() => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [DarkThemeBasePageComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DarkThemeBasePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
