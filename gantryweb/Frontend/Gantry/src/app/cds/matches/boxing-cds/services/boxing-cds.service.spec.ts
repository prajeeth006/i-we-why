import { TestBed } from '@angular/core/testing';
import { BoxingCdsService } from './boxing-cds.service';
import { MockBoxingCdsData } from '../mocks/mock-boxing-cds-data';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';

describe('BoxingCdsService', () => {
  let service: BoxingCdsService;
  let boxingCdsMockdata: MockBoxingCdsData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(BoxingCdsService);
    boxingCdsMockdata = new MockBoxingCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create boxing cds for fight result length', () => {
    const finalBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
    if (finalBetting) {
      expect(finalBetting?.selections?.length).toBe(1);
    }
  });
  it('create boxing cds fight result and check home team price', () => {
    const finalBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
    if (finalBetting) {
      expect(finalBetting?.selections?.[0]?.homePrice).toBe('2/7');
    }
  });
  it('create boxing cds fight result and check homeTitle', () => {
    const finalBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
    if (finalBetting) {
      expect(finalBetting?.selections?.[0]?.homeSelectionTitle).toBe('N. INOUE');
    }
  });
  it('create boxing cds fight result and check awayTitle', () => {
    const finalBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
    if (finalBetting) {
      expect(finalBetting?.selections?.[0]?.awaySelectionTitle).toBe('S. FULTON');
    }
  });
  it('create boxing cds fight result and check awayteam price', () => {
    const finalBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
    if (finalBetting) {
      expect(finalBetting?.selections?.[0]?.awayPrice).toBe('11/4');
    }
  });

  it('create boxing cds fight result and check Drawteam price', () => {
    const finalBetting = service.getFightBettingData(boxingCdsMockdata.matchBetting);
    if (finalBetting) {
      expect(finalBetting?.selections?.[0]?.drawPrice).toBe('16');
    }
  });

  it('create boxing cds methodOfVictory result and check awayprice', () => {
    const methodOfVictory = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
    if (methodOfVictory) {
      expect(methodOfVictory?.selections?.[0]?.awayPrice).toBe('9/2');
    }
  });

  it('create boxing cds methodOfVictory result and check homePrice', () => {
    const methodOfVictory = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
    if (methodOfVictory) {
      expect(methodOfVictory?.selections?.[0]?.homePrice).toBe('2');
    }
  });

  it('create boxing cds methodOfVictory result and check selectionName', () => {
    const methodOfVictory = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
    if (methodOfVictory) {
      expect(methodOfVictory?.selections?.[0]?.name).toBe('ON POINTS (FULL DISTANCE)');
    }
  });

  it('create boxing cds methodOfVictory result and check selectionName', () => {
    const methodOfVictory = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
    if (methodOfVictory) {
      expect(methodOfVictory?.selections?.[1]?.name).toBe('KO / TKO / TECHNICAL DECISION OR DQ');
    }
  });

  it('create boxing cds methodOfVictory result and check hometeam price', () => {
    const methodOfVictory = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
    if (methodOfVictory) {
      expect(methodOfVictory?.selections?.[1]?.homePrice).toBe('1');
    }
  });

  it('create boxing cds methodOfVictory result and check hometeam price', () => {
    const methodOfVictory = service.getMethodOfVictory(boxingCdsMockdata.methodOfVictory);
    if (methodOfVictory) {
      expect(methodOfVictory?.selections?.[1]?.awayPrice).toBe('8');
    }
  });

  it('create boxing cds roundGroupBetting result and check awayTeam price', () => {
    const roundGroupBetting = service.getRoundGroupBetting(boxingCdsMockdata.roundGroupBetting);
    if (roundGroupBetting) {
      expect(roundGroupBetting?.selections?.[0]?.awayPrice).toBe('40');
    }
  });
  it('create boxing cds roundGroupBetting result and check homeTeam price', () => {
    const roundGroupBetting = service.getRoundGroupBetting(boxingCdsMockdata.roundGroupBetting);
    if (roundGroupBetting) {
      expect(roundGroupBetting?.selections?.[0]?.homePrice).toBe('9');
    }
  });
  it('create boxing cds roundGroupBetting result and check Name', () => {
    const roundGroupBetting = service.getRoundGroupBetting(boxingCdsMockdata.roundGroupBetting);
    if (roundGroupBetting) {
      expect(roundGroupBetting?.selections?.[0]?.name).toBe('1-3');
    }
  });
  it('create boxing cds roundGroupBetting result and check Name', () => {
    const roundGroupBetting = service.getRoundGroupBetting(boxingCdsMockdata.roundGroupBetting);
    if (roundGroupBetting) {
      expect(roundGroupBetting?.selections?.[1]?.name).toBe('4-6');
    }
  });
  it('create boxing cds roundGroupBetting result and check Name', () => {
    const roundGroupBetting = service.getRoundGroupBetting(boxingCdsMockdata.roundGroupBetting);
    if (roundGroupBetting) {
      expect(roundGroupBetting?.selections?.[1]?.name).toBe('4-6');
    }
  });

  it('create boxing cds roundBetting result and check Name', () => {
    const roundBetting = service.getIndividualRoundBettingData(boxingCdsMockdata.roundBetting);
    if (roundBetting) {
      expect(roundBetting?.awayTeamListDetails[1]?.betName).toBe('ROUND 2');
    }
  });
  it('create boxing cds roundBetting result and check awayPrice', () => {
    const roundBetting = service.getIndividualRoundBettingData(boxingCdsMockdata.roundBetting);
    if (roundBetting) {
      expect(roundBetting?.awayTeamListDetails[1]?.betOdds).toBe('100');
    }
  });
  it('create boxing cds roundBetting result and check awayPrice', () => {
    const roundBetting = service.getIndividualRoundBettingData(boxingCdsMockdata.roundBetting);
    if (roundBetting) {
      expect(roundBetting?.homeTeamListDetails[1]?.betOdds).toBe('25');
    }
  });
});
