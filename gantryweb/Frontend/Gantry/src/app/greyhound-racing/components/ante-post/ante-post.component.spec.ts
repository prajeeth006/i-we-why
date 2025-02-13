import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { GreyHoundRacingAntePostComponent } from './ante-post.component';
import { GreyhoundStaticContent } from '../../models/greyhound-racing-template.model';

describe("GreyHoundRacingAntePostComponent",()=>{

  let component: GreyHoundRacingAntePostComponent;
  let fixture: ComponentFixture<GreyHoundRacingAntePostComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ GreyHoundRacingAntePostComponent ],
      providers: [ MockContext.providers ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreyHoundRacingAntePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create vm', () => {
    expect(component.vm$).toBeTruthy();
  });

  it('Page shouldn\'t broke because of unexpected DF data', () => {
    expect(component.prepareResult(undefined, new GreyhoundStaticContent())).toBeUndefined();
  });

});