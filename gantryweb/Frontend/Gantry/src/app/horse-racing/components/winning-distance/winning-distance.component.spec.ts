import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { WinningDistanceComponent } from './winning-distance.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WinningDistanceComponent', () => {
  let component: WinningDistanceComponent;
  let fixture: ComponentFixture<WinningDistanceComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WinningDistanceComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinningDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Page shouldn\'t broke because of unexpected DF data', () => {
    expect(component.prepareResult(undefined, undefined)).not.toBeUndefined();
  });

});
