import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { RacingContentServiceMock } from '../../mocks/horse-racing-service.mock';
import { EventSourceDataFeedServiceMock } from '../../../common/mocks/event-source-data-feed-service.mock';

import { RacingContentService } from './racing-content.service';

describe('RacingContentService', () => {
  let service: RacingContentService;

  beforeEach(() => {
    MockContext.useMock(RacingContentServiceMock);
    MockContext.useMock(EventSourceDataFeedServiceMock);
    MockContext.useMock(RouteDataServiceMock);
    TestBed.configureTestingModule({
      providers: [ MockContext.providers ]
    });
    service = TestBed.inject(RacingContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
