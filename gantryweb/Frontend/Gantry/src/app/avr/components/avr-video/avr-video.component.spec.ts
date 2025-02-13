import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
//import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { EventFeedUrlService } from '../../../common/services/event-feed-url.service';

import { AvrVideoComponent } from './avr-video.component';

describe('AvrVideoComponent', () => {
  let component: AvrVideoComponent;
  let fixture: ComponentFixture<AvrVideoComponent>;

  beforeEach(async () => {    
    MockContext.useMock(RouteDataServiceMock);
    //MockContext.useMock(EventFeedUrlService);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      declarations: [ AvrVideoComponent ],
      imports: [HttpClientTestingModule],
      providers: [MockContext.providers, HttpClientTestingModule,EventFeedUrlService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvrVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
