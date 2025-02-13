import { TestBed } from '@angular/core/testing';
import { Mock, MockContext } from 'moxxi';
import { EventFeedUrlService } from './event-feed-url.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('HorseRacingService', () => {
  let service: EventFeedUrlService;

  beforeEach(() => {
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [MockContext.providers, HttpClientTestingModule]
    });
    service = TestBed.inject(EventFeedUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

@Mock({ of: ActivatedRoute })
class ActivatedRouteMock {
}

