
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Formula1CdsService } from './formula1-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { MockFormula1CdsData } from '../mock/formula1-cds-data.mock';
import { Formula1CdsContent, Racers } from '../models/formula1-cds-content.model';

describe('Formula1CdsService', () => {
  let service: Formula1CdsService;
  let formula1CdsMockdata: MockFormula1CdsData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(Formula1CdsService);
    formula1CdsMockdata = new MockFormula1CdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // formula1 sport name
  it('get formula 1 sport name', () => {
    let formula1CdsContent = new Formula1CdsContent();
    formula1CdsContent.content = formula1CdsMockdata.formula1Content;
    service.prepareFormula1CdsContent(formula1CdsContent, formula1CdsMockdata.fixtureViewData, formula1CdsMockdata.markets);
    if (!!formula1CdsContent) {
      expect(formula1CdsContent.sportName).toBe("FORMULA 1");
    }
  });

  // formula1 racer list 
  it('create formula1 cds template result and check racing list', () => {
    let formula1CdsContent = new Formula1CdsContent();
    service.prepareFormula1CdsContent(formula1CdsContent, formula1CdsMockdata.fixtureViewData, formula1CdsMockdata.markets);
    if (formula1CdsContent?.racerList) {
      expect(formula1CdsContent.racerList.length).toBe(2);
    }
  });

  // racer selection list
  it('create odds data for racer selection list', () => {   
    let racer = new Racers();
    let racerName: string = "Alonso";
    let fastestLapDataOrder1 = formula1CdsMockdata?.fixtureViewData?.fixture?.games?.find(x => x.templateId == 216);
    service.addOddsDataInSelectionList(racer, racerName,1, fastestLapDataOrder1);
    if (!!racer) {
      expect(racer.selectionDetails.length).toBe(1);
    }
  });

});