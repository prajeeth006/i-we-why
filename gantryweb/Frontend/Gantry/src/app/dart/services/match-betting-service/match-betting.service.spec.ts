import { TestBed } from '@angular/core/testing';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { DartTemplateContent } from '../../models/dart-template.model';
import { MockDartData } from '../../mocks/mocks-dart-data.mock';
import { MatchBettingService } from './match-betting.service';

describe('MatchBettingService', () => {
  let service: MatchBettingService;
  let mockdata: MockDartData;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchBettingService);
    mockdata = new MockDartData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return darts correct home player', () => {
    let dartTemplateContent = new DartTemplateContent();
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    let marketName = "MATCH BETTING";
    let marketData = mockdata.matchBettingMarket;
    for (let [, selection] of marketData.selections) {
      let selectionName = selection.selectionName;
      if (!selections[marketName]) {
        selections[marketName] = {};
      }
      selections[marketName][selectionName] = selection;
    }
    let isMatchBetting: boolean = true;
    dartTemplateContent.mainEventInfoPanel = service.setMatchDetails(marketName, dartTemplateContent, selections, isMatchBetting);

    expect(dartTemplateContent.homePlayerTitle).toBe('Ken Mather');
  });

  it('should be return darts correct away player', () => {
    let dartTemplateContent = new DartTemplateContent();
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    let marketData = mockdata.matchBettingMarket;
    let marketName = "MATCH BETTING";
    for (let [, selection] of marketData.selections) {
      let selectionName = selection.selectionName;
      if (!selections[marketName]) {
        selections[marketName] = {};
      }

      selections[marketName][selectionName] = selection;
    }
    let isMatchBetting: boolean = true;
    dartTemplateContent.mainEventInfoPanel = service.setMatchDetails(marketName, dartTemplateContent, selections, isMatchBetting);

    expect(dartTemplateContent.awayPlayerTitle).toBe('Beau Anderson');
  });
});
