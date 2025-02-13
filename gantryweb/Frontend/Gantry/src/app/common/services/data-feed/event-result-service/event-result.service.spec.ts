import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../mocks/event-feed-url-service.mock';

import { EventResultService } from './event-result.service';

describe('EventResultService', () => {
  let service: EventResultService;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(EventResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
