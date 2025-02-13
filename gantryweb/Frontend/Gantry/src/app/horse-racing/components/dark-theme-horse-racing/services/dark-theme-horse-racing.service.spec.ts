import { TestBed } from '@angular/core/testing';

import { DarkThemeHorseRacingService } from './dark-theme-horse-racing.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';

describe('DarkThemeHorseRacingService', () => {
  let service: DarkThemeHorseRacingService;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(DarkThemeHorseRacingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
