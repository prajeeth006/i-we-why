import { TossService } from './toss-service';
import { CricketContentMockData, CricketSportBookMockDataT3 } from '../../mocks/mock-cricket-data';
import { CricketTemplateResult, MatchData } from '../../models/cricket-template.model';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { CommonUtilityService } from '../common/common-utility.service';
import { MatchBettingService } from '../match-betting-service/match-betting.service';

describe('TossService', () => {
    let service: TossService;
    let matchBettingService: MatchBettingService;
    let cricketMockDataT3: CricketSportBookMockDataT3;
    let cricketContentMockdata: CricketContentMockData;

    beforeEach(() => {
        service = new TossService();
        matchBettingService = new MatchBettingService(new CommonUtilityService());
        cricketMockDataT3 = new CricketSportBookMockDataT3();
        cricketContentMockdata = new CricketContentMockData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('create cricket template in To Win The Toss result and check home team Title', () => {
        let cricketTemplateResult = new CricketTemplateResult();
        cricketTemplateResult.cricketCountries = cricketContentMockdata.cricketCountriesMockData
        cricketTemplateResult.tossOrLeadInfoPanel = new MatchData();
        let matchBettingSelections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
        matchBettingSelections["MATCH BETTING"] = {};
        matchBettingSelections["MATCH BETTING"]["INDIA"] = cricketMockDataT3.matchBettingHomeS;

        let selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } } = {};
        selections["TO WIN THE TOSS"] = {};
        selections["TO WIN THE TOSS"]["INDIA"] = cricketMockDataT3.toWinTheTossHome;

        cricketTemplateResult = matchBettingService.setMatchDetails("MATCH BETTING", cricketTemplateResult, matchBettingSelections);
        cricketTemplateResult = service.setTossDetails("TO WIN THE TOSS", cricketTemplateResult, selections);
        expect(cricketTemplateResult.tossOrLeadInfoPanel.homeTeamDetails.betName).toBe("INDIA");
        expect(cricketTemplateResult.tossOrLeadInfoPanel.homeTeamDetails.betOdds).toBe("5/11");
      });
      
});