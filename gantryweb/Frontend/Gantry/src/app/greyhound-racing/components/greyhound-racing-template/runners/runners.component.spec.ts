import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { GreyhoundRunnersComponent } from './runners.component'

describe('GreyhoundRunnersComponent', () => {
  let component: GreyhoundRunnersComponent;
  let fixture: ComponentFixture<GreyhoundRunnersComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ GreyhoundRunnersComponent ],
      providers: [ MockContext.providers ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreyhoundRunnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
