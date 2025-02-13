import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { AvrPreambleComponent } from './avr-preamble.component';
import { AvrDataFeedServiceMock } from '../../../common/mocks/avr-data-feed-service.mock';

describe('AvrPreambleComponent', () => {
  let component: AvrPreambleComponent;
  let fixture: ComponentFixture<AvrPreambleComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    MockContext.useMock(AvrDataFeedServiceMock);
    await TestBed.configureTestingModule({
      declarations: [AvrPreambleComponent],
      imports: [HttpClientTestingModule],
      providers: [MockContext.providers]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvrPreambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
