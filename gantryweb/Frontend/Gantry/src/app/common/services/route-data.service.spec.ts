import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { RouteDataService } from './route-data.service';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRouteMock } from '../mocks/activated-route.mock';

describe('RouteDataService', () => {
  let service: RouteDataService;

  beforeEach(() => {
    MockContext.useMock(ActivatedRouteMock);

    TestBed.configureTestingModule({
      providers: [MockContext.providers],
      imports: [HttpClientModule,
        RouterTestingModule]
    });
    service = TestBed.inject(RouteDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});