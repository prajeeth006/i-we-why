import { TestBed } from '@angular/core/testing';
import { ManualGreyhoundRacingTemplateService } from './manual-greyhound-racing-template.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { MockManualGreyhoundRacingRunnersData } from '../mocks/mock-manual-greyhound-racing-runners-data';
import { MockManualGreyhoundRacingResultsData } from '../mocks/mock-manual-greyhound-racing-results-data';
import { ManualGreyhoundRacingResponse } from '../../../models/greyhound-racing-manual-template.model';
import { MockGreyhoundStaticContent } from '../../greyhound-racing-template/mocks/mock-greyhound-static-content';

describe('ManualGrayhoundRacingTemplateService', () => {

  let service: ManualGreyhoundRacingTemplateService;

  let mockGreyhoundRacingRunnersData: MockManualGreyhoundRacingRunnersData;
  let mockGreyhoundRacingResultsData: MockManualGreyhoundRacingResultsData;
  let mockGreyhoundStaticContent: MockGreyhoundStaticContent;
  let racingResponse: ManualGreyhoundRacingResponse;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers],
    });
    service = TestBed.inject(ManualGreyhoundRacingTemplateService);
    mockGreyhoundRacingRunnersData = new MockManualGreyhoundRacingRunnersData();
    mockGreyhoundRacingResultsData = new MockManualGreyhoundRacingResultsData();
    mockGreyhoundStaticContent = new MockGreyhoundStaticContent();
    racingResponse = new ManualGreyhoundRacingResponse();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("when prepareRunnersContent with all required parameters called it should ", () => {
    racingResponse.manualGreyhoundRacingRunners =
      service.prepareRunnersContent(mockGreyhoundStaticContent.greyhoundRacingContent,
        mockGreyhoundRacingRunnersData.manualracingResult,
        null);
    expect(racingResponse.manualGreyhoundRacingRunners.greyhoundRacingEntries.length).toBe(6);
    expect(racingResponse.manualGreyhoundRacingRunners.favPrice).toBe(0.01);
  });

  it("when prepareResultContent with all required parameters called it should ", () => {
    racingResponse.manualGreyhoundRacingResults =
      service.prepareResultContent(mockGreyhoundStaticContent.greyhoundRacingContent,
        mockGreyhoundRacingResultsData.manualracingResult,
        null);
    expect(racingResponse.manualGreyhoundRacingResults.runners.length).toBe(4);
  });

  it("when eachWay with correct parameters", () => {
    let eachWay = service.setEachWay('2 places 1/4 odds');
    expect(eachWay).toBe('EACH-WAY: 1/4 ODDS, 2 PLACES');
  });

  it("when get price with correct parameter and spaces in it", () => {
    expect(service.getPrice(' 1/1000 ')
    ).toBe('1/1000');
  });

  it("getprice for empty value or space", () => {
    expect(service.getPrice('  ')
    ).toBe('');
  });

  it("getprice method with denominator as 1", () => {
    expect(service.getPrice('5/1')).toBe('5');
  });

  it("premareevs if passed 1/1", () => {
    expect(
      service.prepareEvs('1/1')).toBe('EVS');
  });

  it("prepareevs to remove denominator 1 ", () => {
    expect(service.prepareEvs('3/1')).toBe('3/1');
  });

  it("Actual price with decimal value", () => {
    expect(service.actualPrice('3/2')).toBe(1.5);
  });

  it("Actual price with numaric Value", () => {
    expect(service.actualPrice('3')).toBe(3);
  });
});
