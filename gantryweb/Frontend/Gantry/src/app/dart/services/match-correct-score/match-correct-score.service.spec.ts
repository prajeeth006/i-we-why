import { TestBed } from '@angular/core/testing';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { MockDartData } from '../../mocks/mocks-dart-data.mock';
import { DartTemplateContent } from '../../models/dart-template.model';

import { MatchCorrectScoreService } from './match-correct-score.service';

describe('MatchCorrectScoreService', () => {
  let service: MatchCorrectScoreService;
  let mockdata: MockDartData;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchCorrectScoreService);
    mockdata = new MockDartData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Check dart for  correct score betting market and check home team bet name', () => {
    let dartTemplateContent = new DartTemplateContent();
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    let marketData = mockdata.correctScoreBetting;
    let marketName = "CORRECT SCORE";
    dartTemplateContent.homePlayerTitle = "Ken Mather";
    for (let [, selection] of marketData.selections) {
      let selectionName = selection.selectionName?.replaceAll('|', '');
      if (!selections[marketName]) {
        selections[marketName] = {};
      }

      selections[marketName][selectionName] = selection;
    }
    dartTemplateContent = service.setCorrectScore(marketName, dartTemplateContent, selections);
    expect(dartTemplateContent.correctScoreBettingInfoPanel.homeTeamListDetails[0].betName).toBe("6-7");
  });

  it('Check dart for correct score betting market and check away team bet name', () => {
    let dartTemplateContent = new DartTemplateContent();
    let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
    let marketData = mockdata.correctScoreBetting;
    let marketName = "CORRECT SCORE";
    dartTemplateContent.awayPlayerTitle = "Beau Anderson";
    for (let [, selection] of marketData.selections) {
      let selectionName = selection.selectionName?.replaceAll('|', '');
      if (!selections[marketName]) {
        selections[marketName] = {};
      }

      selections[marketName][selectionName] = selection;
    }
    dartTemplateContent = service.setCorrectScore(marketName, dartTemplateContent, selections);
    expect(dartTemplateContent.correctScoreBettingInfoPanel.awayTeamListDetails[0].betName).toBe("6-7");
  });
});
