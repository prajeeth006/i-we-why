import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../mocks/activated-route.mock';
import { RouteDataServiceMock } from '../mocks/route-data-service.mock';
import { AntiPostService } from './ante-post.service';
import { AntePostResult } from '../models/ante-post.model';

describe('AntiPostService', () => {
  let service: AntiPostService;

  beforeEach(() => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(AntiPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be  return AntePostResult form antePostResult', () =>{
    let result : AntePostResult;
    service.data$.subscribe(value => {
        expect(value).toBe(result);
      });
  });

});
