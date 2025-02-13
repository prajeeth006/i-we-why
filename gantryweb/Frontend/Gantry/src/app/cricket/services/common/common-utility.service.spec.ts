import { CommonUtilityService } from './common-utility.service';
import { CricketSportBookMockDataT1 } from '../../mocks/mock-cricket-data';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { BetDetails, CricketTemplateResult, MatchData } from '../../models/cricket-template.model';

describe('CommonUtilityService', () => {
    let service: CommonUtilityService;
    let cricketMockDataT1: CricketSportBookMockDataT1;

    beforeEach(() => {
        service = new CommonUtilityService();
        cricketMockDataT1 = new CricketSportBookMockDataT1();
    });

    it('check odds format', () => {
        let selection: { [selectionName: string]: SportBookSelection } = {}
        selection["ENGLAND"] = cricketMockDataT1.matchBettingAwayS;
        expect(service.setOddsFormat("ENGLAND", selection)).toBe("2 / 12");
    });

    it('set home team details', () => {
        let teamDetail: BetDetails = new BetDetails("INDIA", "1 / 12", false);
        let teams: MatchData = new MatchData();
        let cricketTemplateResult = new CricketTemplateResult();
        let response = service.setHomeDrawOrAwayDetails(cricketMockDataT1.matchBettingHomeS, teamDetail, teams, cricketTemplateResult);
        expect(response.homeTeamDetails.betName).toBe("INDIA");
    });

    it('set away team details', () => {
        let teamDetail: BetDetails = new BetDetails("ENGLAND", "2 / 12", false);
        let teams: MatchData = new MatchData();
        let cricketTemplateResult = new CricketTemplateResult();
        let response = service.setHomeDrawOrAwayDetails(cricketMockDataT1.matchBettingAwayS, teamDetail, teams, cricketTemplateResult);
        expect(response.awayTeamDetails.betName).toBe("ENGLAND");
    });

    it('set cricket page title', () => {
        let cricketTemplateResult = new CricketTemplateResult();
        cricketTemplateResult.mainEventInfoPanel = {
            homeTeamDetails: {
                betName: "INDIA",
                betOdds: "1 / 13",
                hideOdds: false,
                hideEntry: false
            },
            awayTeamDetails: {
                betName: "ENGLAND",
                betOdds: "2 / 13",
                hideOdds: false,
                hideEntry: false
            },
            drawMatchDetails: {
                betName: "DRAW",
                betOdds: " 3 / 13",
                hideOdds: false,
                hideEntry: false

            }
        }
        let response = service.setCricketPageTitle(cricketTemplateResult);
        expect(response.title).toBe("INDIA V ENGLAND");
    });

});