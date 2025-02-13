import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { TennisContentService } from './tennis-content.service';

describe("TennisContentService", ()=>{
let tennisContentService: TennisContentService;

beforeEach(() => {
  MockContext.useMock(EventFeedUrlServiceMock);
  MockContext.useMock(ActivatedRouteMock);
  TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ MockContext.providers ]
    });
    tennisContentService = TestBed.inject(TennisContentService);
  });

  it('should be created', () => {
    expect(tennisContentService).toBeTruthy();
  });

});