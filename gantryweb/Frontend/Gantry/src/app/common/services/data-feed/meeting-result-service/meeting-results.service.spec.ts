import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../mocks/event-feed-url-service.mock';
import { CommonResultsServiceMock } from '../../../mocks/common-results-service.mock';
import { MeetingResultsService } from './meeting-results.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('MeetingResultsService', () => {
  let service: MeetingResultsService;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(CommonResultsServiceMock);

    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(MeetingResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});