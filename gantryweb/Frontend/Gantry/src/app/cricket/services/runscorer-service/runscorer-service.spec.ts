import { RunscorerService } from './runscorer-service';
import { MatchBettingService } from '../match-betting-service/match-betting.service';
import { CricketContentMockData, CricketSportBookMockDataT1 } from '../../mocks/mock-cricket-data';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { CricketTemplateResult, TopRunScorerList } from '../../models/cricket-template.model';
import { CommonUtilityService } from '../common/common-utility.service';

describe('RunscorerService', () => {
    let service: RunscorerService;
    let matchBettingService: MatchBettingService;
    let cricketContentMockdata: CricketContentMockData;
    let cricketMockDataT1: CricketSportBookMockDataT1;

    beforeEach(() => {
        service = new RunscorerService();
        matchBettingService = new MatchBettingService(new CommonUtilityService());
        cricketMockDataT1 = new CricketSportBookMockDataT1();
        cricketContentMockdata = new CricketContentMockData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('create cricket template in Total RunScorer result and check away team Title', () => {
        let cricketTemplateResult = new CricketTemplateResult();
        cricketTemplateResult.cricketCountries = cricketContentMockdata.cricketCountriesMockData
        cricketTemplateResult.topRunScorer = new TopRunScorerList();
        let matchBettingSelections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
        matchBettingSelections["MATCH BETTING"] = {};
        matchBettingSelections["MATCH BETTING"]["BANGLADESH"] = cricketMockDataT1.matchBettingAwayS;

        let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
        selections["BANGLADESH TOP RUNSCORER"] = {};
        selections["BANGLADESH TOP RUNSCORER"]["AMIM IQBAL"] = cricketMockDataT1.topTeamRunScorerAwayS1;

        cricketTemplateResult = matchBettingService.setMatchDetails("MATCH BETTING", cricketTemplateResult, matchBettingSelections);
        cricketTemplateResult.topRunScorer = service.setTopRunScorers("BANGLADESH TOP RUNSCORER", cricketTemplateResult, cricketTemplateResult.topRunScorer, selections);
        expect(cricketTemplateResult.topRunScorer.awayTeamTopRunScorerList[0].betName).toBe("AMIM IQBAL");
        expect(cricketTemplateResult.topRunScorer.awayTeamTopRunScorerList[0].betOdds).toBe("4/13");
      });

});