import { MatchBettingService } from '../match-betting-service/match-betting.service';
import { CricketContentMockData, CricketSportBookMockDataT1 } from '../../mocks/mock-cricket-data';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { CricketTemplateResult, TopRunScorerList } from '../../models/cricket-template.model';
import { CommonUtilityService } from '../common/common-utility.service';

describe('MatchBettingService', () => {
   
    let matchBettingService: MatchBettingService;
    let cricketContentMockdata: CricketContentMockData;
    
    //let mockCommonUtilityService;
    let cricketMockDataT1: CricketSportBookMockDataT1;

    beforeEach(() => {
        //mockCommonUtilityService = jasmine.createSpyObj(['setOddsFormat', 'setHomeDrawOrAwayDetails', 'setCricketPageTitle']);
        matchBettingService = new MatchBettingService(new CommonUtilityService());
        cricketMockDataT1 = new CricketSportBookMockDataT1();
        cricketContentMockdata = new CricketContentMockData();
    });

    it('should be created', () => {
        expect(matchBettingService).toBeTruthy();
    });

    it('create cricket template in Total RunScorer result and check home team Title', () => {
        let cricketTemplateResult = new CricketTemplateResult();
        cricketTemplateResult.cricketCountries = cricketContentMockdata.cricketCountriesMockData
        cricketTemplateResult.topRunScorer = new TopRunScorerList();
        let matchBettingSelections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
        matchBettingSelections["MATCH BETTING"] = {};
        matchBettingSelections["MATCH BETTING"]["BANGLADESH"] = cricketMockDataT1.matchBettingAwayS;

        cricketTemplateResult = matchBettingService.setMatchDetails("MATCH BETTING", cricketTemplateResult, matchBettingSelections);
        expect(cricketTemplateResult.mainEventInfoPanel.awayTeamDetails.betName).toBe("BANGLADESH");
        expect(cricketTemplateResult.mainEventInfoPanel.awayTeamDetails.betOdds).toBe("2/12");
    });

});