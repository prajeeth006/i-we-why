
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../mocks/event-feed-url-service.mock'; 
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { LatestSixResultsTemplateComponent } from './latest-six-results-template.component';

describe('LatestSixResultsTemplateComponent', () => {
  let component: LatestSixResultsTemplateComponent;
  let fixture: ComponentFixture<LatestSixResultsTemplateComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ LatestSixResultsTemplateComponent ],
      providers: [ MockContext.providers ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestSixResultsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
