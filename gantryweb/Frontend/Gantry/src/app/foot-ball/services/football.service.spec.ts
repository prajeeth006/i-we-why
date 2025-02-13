import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FootballService } from './football.service';
import { MockFootballData } from '../mocks/mock-football-data';
import { GantryMock } from '../../common/mocks/gantrymarkets.mock';
import { MockNFLData } from '../mocks/mock-nfl-data';
import { RouterTestingModule } from "@angular/router/testing";
import { FootballContent } from '../models/football.model';


describe('FootballService', () => {
  let service: FootballService;
  let footballMockdata: MockFootballData;
  let nflMockdata: MockNFLData;
  let gantryMockData: GantryMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    
    footballMockdata = new MockFootballData();
    gantryMockData = new GantryMock();
    nflMockdata = new MockNFLData();
    service = TestBed.inject(FootballService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set event key and market keys for football', () => {
    expect(service.setEvenKeyAndMarketKeys(footballMockdata.eventId, footballMockdata.marketIds)).toBe();
  });

  it('set event key and market keys for nfl', () => {
    expect(service.setEvenKeyAndMarketKeys(nflMockdata.eventId, nflMockdata.marketIds)).toBe();
  });

  it('Match Result Market should have one home team bet for football', () => {
    let footballContent = new FootballContent();
    service["prepareMarket"]('FOOTBALL', [...footballMockdata.markets][0][1], gantryMockData.Data, footballContent, footballMockdata.staticContent  );
    expect(footballContent?.marketResult?.matchResult?.leftBetList.length).toBe(1);
  });

  it('Match Result Market should have one away team bet for football', () => {
    let footballContent = new FootballContent();
    service["prepareMarket"]('FOOTBALL', [...footballMockdata.markets][0][1], gantryMockData.Data, footballContent , footballMockdata.staticContent );
    expect(footballContent?.marketResult?.matchResult?.rightBetList.length).toBe(1);
  });
  
  it('Match Result Market should have one draw bet for football', () => {
    let footballContent = new FootballContent();
    service["prepareMarket"]('FOOTBALL', [...footballMockdata.markets][0][1], gantryMockData.Data, footballContent, footballMockdata.staticContent );
    expect(footballContent?.marketResult?.matchResult?.drawBetList?.length).toBe(1);
  });
  
  it('Prepare Result should have markets result for football', () => {
    let footballContent = new FootballContent();
    service["prepareMarket"]('FOOTBALL', [...footballMockdata.markets][0][1], gantryMockData.Data, footballContent, footballMockdata.staticContent );
    expect(footballContent?.marketResult?.matchResult?.leftBetList.length).toBe(1);
  });

});
