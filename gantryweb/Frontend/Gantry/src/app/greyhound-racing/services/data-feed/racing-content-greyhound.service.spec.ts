import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { RacingContentGreyhoundService } from './racing-content-greyhound.service';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { EventSourceDataFeedServiceMock } from '../../../common/mocks/event-source-data-feed-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RacingContentGreyhoundService', () => {
  let service: RacingContentGreyhoundService;

  beforeEach(() => {
    MockContext.useMock(EventSourceDataFeedServiceMock);
    MockContext.useMock(RouteDataServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ MockContext.providers ]
    });
    service = TestBed.inject(RacingContentGreyhoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
