import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';

import { GreyhoundResultComponent } from './result.component';

describe('GreyhoundResultComponent', () => {
  let component: GreyhoundResultComponent;
  let fixture: ComponentFixture<GreyhoundResultComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ GreyhoundResultComponent ],
      providers: [ MockContext.providers ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreyhoundResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
