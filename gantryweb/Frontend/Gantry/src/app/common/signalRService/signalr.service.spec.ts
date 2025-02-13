import { TestBed } from '@angular/core/testing';
import { SignalrService } from './signalr.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../mocks/route-data-service.mock';

describe('SignalrService', () => {
  let service: SignalrService;

  beforeEach(() => {
    MockContext.useMock(RouteDataServiceMock);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(SignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
