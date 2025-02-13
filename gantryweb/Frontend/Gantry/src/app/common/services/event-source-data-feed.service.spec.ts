import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ElectronParamsServiceMock } from '../../common/mocks/electron-params-service.mock'
import { EventSourceDataFeedService } from '../services/event-source-data-feed.service'

describe('EventSourceDataFeedService', () => {
  let service: EventSourceDataFeedService;

  beforeEach(() => {
    MockContext.useMock(ElectronParamsServiceMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(EventSourceDataFeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

