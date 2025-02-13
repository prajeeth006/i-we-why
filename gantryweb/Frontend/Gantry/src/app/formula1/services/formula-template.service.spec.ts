import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { MockFormulaData } from '../mocks/mocks-formula1-dara.mock';

import { FormulaTemplateService } from './formula-template.service';
import { GantryMock } from '../../common/mocks/gantrymarkets.mock';


describe('FormulaTemplateService', () => {
  let service: FormulaTemplateService;
  let mockFormulaData: MockFormulaData;
  let gantryMockData: GantryMock;
  
  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],      
      providers: [MockContext.providers]
    });
    service = TestBed.inject(FormulaTemplateService);
    mockFormulaData = new MockFormulaData();
    gantryMockData = new GantryMock();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Formula: set event key and market keys', () => {
    expect(service.setEvenKeyAndMarketKeys(mockFormulaData.eventId, mockFormulaData.marketIds)).toBe();
  });

  it('Check formula selection of racewinner', () => {
    expect(service.prepareResult(mockFormulaData.sportBookResult, mockFormulaData.mockDataContent, gantryMockData.Data).racerList[0]?.driverName).toBe("Lewis Hamilton");    
 });
});
