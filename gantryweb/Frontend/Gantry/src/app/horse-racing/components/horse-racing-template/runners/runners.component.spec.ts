import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';
import { MockHorseRacingRunnersResultsData } from '../mocks/mock-horse-racing-runners-results-data';
import { RunnersComponent } from './runners.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MaxFixedViewrRunner} from '../../../models/horse-racing-template.model';

describe('RunnersComponent', () => {
  let component: RunnersComponent;
  let fixture: ComponentFixture<RunnersComponent>;
  let mockData :MockHorseRacingRunnersResultsData;
  
  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RunnersComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnersComponent);
    component = fixture.componentInstance;
    mockData = new MockHorseRacingRunnersResultsData();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when maxFixedViewRunner with not null parameters called the result should not be null', () => {
    let result = component.maxFixedViewRunner(mockData);
    expect(result).not.toBeNull();
  });


  it('when race is AVR and screen type is any, Fixed and Viewer runner count should be correct', () => {
    component.screenType="half";
    let result:MaxFixedViewrRunner = component.maxFixedViewRunner(mockData);
    expect(result.maxFixedRunners).toBe(7);
    expect(result.maxViewRunners).toBe(10);

  });
  it('when race is non AVR and screen type is half, Fixed and Viewer runner count should be correct', () => {
    component.screenType="half";
    let result:MaxFixedViewrRunner = component.maxFixedViewRunner(mockData);
    expect(result.maxFixedRunners).toBe(7);
    expect(result.maxViewRunners).toBe(10);
  });

  it('when race is non AVR and screen type is full, Fixed and Viewer runner count should be correct', () => {
    component.screenType="full";
    let result:MaxFixedViewrRunner = component.maxFixedViewRunner(mockData);
    expect(result.maxFixedRunners).toBe(7);
    expect(result.maxViewRunners).toBe(10);
  });


  it('when race is non AVR and screen type is quad, Fixed and Viewer runner count should be correct', () => {
    component.screenType="quad";
    let result:MaxFixedViewrRunner = component.maxFixedViewRunner(mockData);
    expect(result.maxFixedRunners).toBe(7);
    expect(result.maxViewRunners).toBe(10);
  });

  it('when screen type is undefined, Fixed and Viewer runner count should be correct', () => {
    let result:MaxFixedViewrRunner = component.maxFixedViewRunner(mockData);
    expect(result.maxFixedRunners).toBe(7);
    expect(result.maxViewRunners).toBe(10);
  });

});