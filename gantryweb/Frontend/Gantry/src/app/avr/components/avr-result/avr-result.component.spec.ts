import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { AvrDataFeedServiceMock } from '../../../common/mocks/avr-data-feed-service.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { AvrResultServiceMock } from '../../../common/mocks/avr-result-service.mock';
import { AvrResultComponent } from './avr-result.component';
//import { of } from 'rxjs';

describe('AvrResultComponent', () => {
  //let component: AvrResultComponent;
  let fixture: ComponentFixture<AvrResultComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    MockContext.useMock(AvrDataFeedServiceMock);
    MockContext.useMock(AvrResultServiceMock);
    //let resultServiceMock = MockContext.useMock(AvrResultServiceMock);
    // resultServiceMock.data$ = jasmine.createSpyObj('AvrResultServiceMock', {
    //   'avrService$': of('mock data'),
    //   'data$': of('mock data')
    // });
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AvrResultComponent],
      providers: [MockContext.providers]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvrResultComponent);
    //component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
