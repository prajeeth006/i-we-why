import { TestBed } from '@angular/core/testing';
import { NflCdsService } from './nfl-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { NflCdsContent } from '../models/nfl-cds-content.model'
import { MockNFLData } from '../mocks/mocks-nfl-data'
import { RouterTestingModule } from '@angular/router/testing';
import { EventFeedUrlServiceMock } from '../../../../common/mocks/event-feed-url-service.mock';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';


describe('NflCdsService', () => {
  let service: NflCdsService;
  let nflCdsMockdata: MockNFLData;

  beforeEach(() => {
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(NflCdsService);
    nflCdsMockdata = new MockNFLData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Match Betting
  it('create nfl cds template result and check home team', () => {
    let nflCdsResult = new NflCdsContent();
    service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals);
    if (nflCdsResult.games) {
      expect(nflCdsResult?.games[0]?.matchBetting?.homePlayer).toBe("Over 45");
    }
  });

  it('create nfl cds template result and check away team', () => {
    let nflCdsResult = new NflCdsContent();
    service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals);
    if (nflCdsResult.games) {
      expect(nflCdsResult?.games[0]?.matchBetting?.awayPlayer).toBe("Under 45");
    }
  });

  it('create nfl cds template result and check home beeting price', () => {
    let nflCdsResult = new NflCdsContent();
    service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals);
    if (nflCdsResult.games) {
      expect(nflCdsResult?.games[0]?.matchBetting?.homeBettingPrice).toBe("21/20");
    }
  });

  it('create nfl cds template result and check away beeting price', () => {
    let nflCdsResult = new NflCdsContent();
    service.prepareMatchBetting(nflCdsResult, nflCdsMockdata.Totals);
    if (nflCdsResult.games) {
      expect(nflCdsResult?.games[0]?.matchBetting?.awayBettingPrice).toBe("7/10");
    }
  });

});
