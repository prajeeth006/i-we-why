import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeRunnersComponent } from './dark-theme-runners.component';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DarkThemeRunnersComponent', () => {
  let component: DarkThemeRunnersComponent;
  let fixture: ComponentFixture<DarkThemeRunnersComponent>;

  beforeEach(() => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DarkThemeRunnersComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DarkThemeRunnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
