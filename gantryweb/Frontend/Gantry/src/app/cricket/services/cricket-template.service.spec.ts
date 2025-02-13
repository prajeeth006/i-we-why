import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { CricketTemplateService } from './cricket-template.service';
import { RouterTestingModule } from '@angular/router/testing';
import { CricketContentMockData } from '../mocks/mock-cricket-data';
import { GantryMock } from '../../common/mocks/gantrymarkets.mock';
import { CricketSportBookMockDataT1, CricketSportBookMockDataT2, CricketSportBookMockDataT3 } from '../mocks/mock-cricket-data';

describe('CricketTemplateService', () => {
  let service: CricketTemplateService;
  let cricketContentMockdata: CricketContentMockData;
  let gantryMockData: GantryMock;
  let cricketMockDataT1: CricketSportBookMockDataT1;
  let cricketMockDataT2: CricketSportBookMockDataT2;
  let cricketMockDataT3: CricketSportBookMockDataT3;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });

    service = TestBed.inject(CricketTemplateService);

    cricketMockDataT1 = new CricketSportBookMockDataT1();
    cricketMockDataT2 = new CricketSportBookMockDataT2();
    cricketMockDataT3 = new CricketSportBookMockDataT3();
    cricketContentMockdata = new CricketContentMockData();
    gantryMockData = new GantryMock();

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set event key and market keys', () => {
    expect(service.setEventKeyAndMarketKeys(cricketContentMockdata.eventKey, cricketContentMockdata.marketKey)).toBe();
  });

  //Template 1
  // Match Betting
  it('create cricket template result and check home team', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.homeTeamDetails.betName).toBe("INDIA");
  });

  it('create cricket template result and check home team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.homeTeamDetails.betOdds).toBe("1/12");
  });

  it('create cricket template result and check away team', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.awayTeamDetails.betName).toBe("BANGLADESH");
  });

  it('create cricket template result and check away team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.awayTeamDetails.betOdds).toBe("2/12");
  });

  // Total Sixes
  it('create cricket template Total Sixes result and check home team Title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.totalSixes.homeTeamDetails.betName).toBe("OVER 11.5");
  });
  it('create cricket template Total Sixes result and check home team Odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.totalSixes.homeTeamDetails.betOdds).toBe("11/20");
  });
  it('create cricket template Total Sixes result and check away team Title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.totalSixes.awayTeamDetails.betName).toBe("UNDER 11.5");
  });
  it('create cricket template Total Sixes result and check away team Odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.totalSixes.awayTeamDetails.betOdds).toBe("5/13");
  });

  //TOP TEAM RUNSCORER
  it('create cricket template TOP TEAM RUNSCORER result and check home team Title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.topRunScorer.homeTeamTopRunScorerList[0].betName).toBe("VIRAT KOHLI");
    expect(response.topRunScorer.homeTeamTopRunScorerList[1].betName).toBe("ROHIT SHARMA");
    expect(response.topRunScorer.homeTeamTopRunScorerList[2].betName).toBe("RISHABH PANT");
    expect(response.topRunScorer.homeTeamTopRunScorerList[3].betName).toBe("HARDIK PANDYA");
    expect(response.topRunScorer.homeTeamTopRunScorerList[4].betName).toBe("JASPRIT BUMRAH");
  });
  it('create cricket template TOP TEAM RUNSCORER result and check home team Odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.topRunScorer.homeTeamTopRunScorerList[0].betOdds).toBe("1/13");
    expect(response.topRunScorer.homeTeamTopRunScorerList[1].betOdds).toBe("2/13");
    expect(response.topRunScorer.homeTeamTopRunScorerList[2].betOdds).toBe("3/13");
    expect(response.topRunScorer.homeTeamTopRunScorerList[3].betOdds).toBe("4/13");
    expect(response.topRunScorer.homeTeamTopRunScorerList[4].betOdds).toBe("5/13");
    expect(response.topRunScorer.homeTeamTopRunScorerList[4].hideOdds).toBe(false);
  });
  it('create cricket template TOP TEAM RUNSCORER result and check away team Title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.topRunScorer.awayTeamTopRunScorerList[0].betName).toBe("MAHMUDULLAH");
    expect(response.topRunScorer.awayTeamTopRunScorerList[1].betName).toBe("SHAKIB AI HASAN");
    expect(response.topRunScorer.awayTeamTopRunScorerList[2].betName).toBe("MUSHFIQUR RAHIM");
    expect(response.topRunScorer.awayTeamTopRunScorerList[3].betName).toBe("TAMIM IQBAL");
    expect(response.topRunScorer.awayTeamTopRunScorerList[4].betName).toBe("MEHIDY HASAN");
  });
  it('create cricket template TOP TEAM RUNSCORER result and check away team Odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT1.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.topRunScorer.awayTeamTopRunScorerList[0].betOdds).toBe("1/13");
    expect(response.topRunScorer.awayTeamTopRunScorerList[1].betOdds).toBe("2/13");
    expect(response.topRunScorer.awayTeamTopRunScorerList[2].betOdds).toBe("3/13");
    expect(response.topRunScorer.awayTeamTopRunScorerList[3].betOdds).toBe("4/13");
    expect(response.topRunScorer.awayTeamTopRunScorerList[4].betOdds).toBe("5/13");
  });




  //Tempate 2
  //Match Betting
  it('create cricket template result and check home team', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.homeTeamDetails.betName).toBe("INDIA");
  });

  it('create cricket template result and check home team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.homeTeamDetails.betOdds).toBe("1/12");
  });

  it('create cricket template result and check draw team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.drawMatchDetails.betOdds).toBe("2/12");
  });

  it('create cricket template result and check away team', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.awayTeamDetails.betName).toBe("ENGLAND");
  });

  it('create cricket template result and check away team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.mainEventInfoPanel.awayTeamDetails.betOdds).toBe("3/12");
  });

  //TOP 1ST INNINGS RUNSCORER
  it('create cricket template TOP 1ST INNINGS RUNSCORER result and check home team title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[0].betName).toBe("VIRAT KOHLI");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[1].betName).toBe("ROHIT SHARMA");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[2].betName).toBe("RISHABH PANT");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[3].betName).toBe("HARDIK PANDYA");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[4].betName).toBe("JASPRIT BUMRAH");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[5].betName).toBe("DINESH KARTHIK");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[6].betName).toBe("RAVINDRA JADEJA");
  });
  it('create cricket template TOP 1ST INNINGS RUNSCORER result and check home team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[0].betOdds).toBe("1/11");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[1].betOdds).toBe("2/11");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[2].betOdds).toBe("3/11");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[3].betOdds).toBe("4/11");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[4].betOdds).toBe("5/11");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[5].betOdds).toBe("6/11");
    expect(response.top1stInningRunScorer.homeTeamTopRunScorerList[6].betOdds).toBe("8/11");
  });
  it('create cricket template TOP 1ST INNINGS RUNSCORER result and check away team title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[0].betName).toBe("BEN STOKES");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[1].betName).toBe("JOE ROOT");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[2].betName).toBe("JONNY BAIRSTOW");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[3].betName).toBe("JOS BUTTLER");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[4].betName).toBe("MATTHEW POTTS");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[5].betName).toBe("MOEEN ALI");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[6].betName).toBe("CHRIS WOAKES");
  });
  it('create cricket template TOP 1ST INNINGS RUNSCORER result and check away team price', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT2.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[0].betOdds).toBe("1/11");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[1].betOdds).toBe("2/11");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[2].betOdds).toBe("3/11");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[3].betOdds).toBe("4/11");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[4].betOdds).toBe("5/11");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[5].betOdds).toBe("6/11");
    expect(response.top1stInningRunScorer.awayTeamTopRunScorerList[6].betOdds).toBe("6/11");
  });





  //Tempate 3

  //TO WIN THE TOSS

  it('create cricket template TO WIN THE TOSS result and check home team title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT3.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.tossOrLeadInfoPanel.homeTeamDetails.betName).toBe("INDIA");
  });
  it('create cricket template TO WIN THE TOSS result and check home team odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT3.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.tossOrLeadInfoPanel.homeTeamDetails.betOdds).toBe("5/11");
  });
  it('create cricket template TO WIN THE TOSS result and check away team title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT3.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.tossOrLeadInfoPanel.awayTeamDetails.betName).toBe("ENGLAND");
  });
  it('create cricket template TO WIN THE TOSS result and check away team odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT3.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.tossOrLeadInfoPanel.awayTeamDetails.betOdds).toBe("10/11");
  });

  //PLAYER TO SCORE 1ST INNINGS 100
  it('create cricket template PLAYER TO SCORE 1ST INNINGS 100 result and check title', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT3.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.toScore100in1stInns[0].betName).toBe("VIRAT KOHLI");
    expect(response.toScore100in1stInns[1].betName).toBe("RISHABH PANT");
    expect(response.toScore100in1stInns[2].betName).toBe("HARDIK PANDYA");
    expect(response.toScore100in1stInns[3].betName).toBe("ROHIT SHARMA");
    expect(response.toScore100in1stInns[4].betName).toBe("BEN STOKES");
    expect(response.toScore100in1stInns[5].betName).toBe("JOE ROOT");
    expect(response.toScore100in1stInns[6].betName).toBe("JONNY BAIRSTOW");
  });
  it('create cricket template PLAYER TO SCORE 1ST INNINGS 100 result and check odds', () => {
    let response = service.createCricketTemplateResult(cricketMockDataT3.sportBookResult, cricketContentMockdata.cricketContentMockData, gantryMockData.Data, cricketContentMockdata.cricketCountriesMockData);
    expect(response.toScore100in1stInns[0].betOdds).toBe("1/3");
    expect(response.toScore100in1stInns[1].betOdds).toBe("5/13");
    expect(response.toScore100in1stInns[2].betOdds).toBe("7/13");
    expect(response.toScore100in1stInns[3].betOdds).toBe("2/3");
    expect(response.toScore100in1stInns[4].betOdds).toBe("9/13");
    expect(response.toScore100in1stInns[5].betOdds).toBe("12/13");
    expect(response.toScore100in1stInns[6].betOdds).toBe("14/15");
  });

});
