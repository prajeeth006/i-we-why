import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeHorseRacingComponent } from './dark-theme-horse-racing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';

describe('DarkThemeHorseRacingComponent', () => {
  let component: DarkThemeHorseRacingComponent;
  let fixture: ComponentFixture<DarkThemeHorseRacingComponent>;

  beforeEach(() => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DarkThemeHorseRacingComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DarkThemeHorseRacingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
