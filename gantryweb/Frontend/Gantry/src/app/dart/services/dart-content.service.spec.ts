import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';

import { DartContentService } from './dart-content.service';

describe('DartContentService', () => {
  let service: DartContentService;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],      
      providers: [MockContext.providers]
    });
    service = TestBed.inject(DartContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
