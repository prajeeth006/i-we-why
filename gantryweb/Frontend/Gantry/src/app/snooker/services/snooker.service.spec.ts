import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockSnookerData } from '../mocks/mock-snooker-data.mock';
import { SnookerService } from './snooker.service';
import { GantryMock } from '../../common/mocks/gantrymarkets.mock';
import { SnookerContent } from '../models/snooker.model';

describe('SnookerService', () => {
  let service: SnookerService;
  let snookerMockdata: MockSnookerData;
  let gantryMockData: GantryMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    snookerMockdata = new MockSnookerData();
    service = TestBed.inject(SnookerService);
    gantryMockData = new GantryMock();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('set event key and market keys for snooker', () => {
    expect(service.setEvenKeyAndMarketKeys(snookerMockdata.eventId, snookerMockdata.marketIds)).toBe();
  });

  it('Match Result Market should have one home player bet for snooker', () => {
    let market = service["prepareMarket"]([...snookerMockdata.markets][0][1], snookerMockdata.marketResult, gantryMockData.Data);
    expect(market.leftBetList.length).toBe(1);
  });

  it('Match Result Market should have one away player bet for snooker', () => {
    let market = service["prepareMarket"]([...snookerMockdata.markets][0][1], snookerMockdata.marketResult, gantryMockData.Data);
    expect(market.rightBetList.length).toBe(1);
  });

  it('Prepare Result should have players result for snooker', () => {
    let snookerContent = new SnookerContent();
    snookerContent = service["prepareResult"](snookerMockdata.sportBookResult, snookerMockdata.staticContent, gantryMockData.Data);
    expect(snookerContent).toBe(snookerContent);

  });

});
