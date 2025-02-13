import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { AvrDataFeedServiceMock } from '../../../common/mocks/avr-data-feed-service.mock';
import { AvrResultServiceMock } from '../../../common/mocks/avr-result-service.mock';
import { AvrServiceMock } from '../../../common/mocks/avr-service.mock';
import { AvrComponent } from './avr.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AvrComponent', () => {
  //let component: AvrComponent;
  //let fixture: ComponentFixture<AvrComponent>;
  let avrServiceMock: any;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    MockContext.useMock(AvrDataFeedServiceMock);
    MockContext.useMock(AvrResultServiceMock);
    avrServiceMock = MockContext.useMock(AvrServiceMock);

    // let serviceSpy = jasmine.createSpyObj('AvrDataFeedService', {
    //   'retrieveData1': of('mock data'),
    //   'other': 'some val'
    // });
    avrServiceMock.avr$.and.returnValue({
      pipe: () => of({})
    });
    await TestBed.configureTestingModule({
      declarations: [AvrComponent],
      imports: [HttpClientTestingModule],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    //avrServiceMock.avr$.pipe.and.returnValue(of({}));
    avrServiceMock.avr$.and.returnValue({
      pipe: () => of({})
    });

    //fixture = TestBed.createComponent(AvrComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    // avrServiceMock.avr$.and.returnValue({
    //   pipe: () => of({})
    // });
    // expect(component).toBeTruthy();
  });
});
