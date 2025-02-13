import { TestBed } from '@angular/core/testing';

import { FootBallCdsTemplateService } from './foot-ball-cds-template.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { MockFootBallCdsData } from '../mocks/mock-football-cds-data';

describe('FootBallCdsTemplateService', () => {
  let service: FootBallCdsTemplateService;
  let footBallCdsMockdata: MockFootBallCdsData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(FootBallCdsTemplateService);
    footBallCdsMockdata = new MockFootBallCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create FootBall cds for matchResult length', () => {
    const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult)
    if (finalResult) {
      expect(finalResult?.selections?.length).toBe(1);
    }
  });

  it('create FootBall cds for matchResult and check awayPrice', () => {
    const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult);
    if (finalResult) {
      expect(finalResult?.selections?.[0].awayPrice).toBe("7/10");
    }
  });

  it('create FootBall cds for matchResult and check check awaySelectionTitle', () => {
    const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult);
    if (finalResult) {
      expect(finalResult?.selections?.[0].awaySelectionTitle).toBe("FC LEGNAGO SALUS SSD");
    }
  });

  it('create FootBall cds for matchResult and check and check homeTitle', () => {
    const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult);
    if (finalResult) {
      expect(finalResult?.selections?.[0].homeSelectionTitle).toBe("GANDHINAGAR FC");
    }
  });

  it('create FootBall cds for matchResult and check and check homeTitle', () => {
    const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult);
    if (finalResult) {
      expect(finalResult?.selections?.[0].homePrice).toBe("27/4");
    }
  });

  it('create FootBall cds for matchResult and check and check drawPrice', () => {
    const finalResult = service.getMatchResult(footBallCdsMockdata.finalResult);
    if (finalResult) {
      expect(finalResult?.selections?.[0].drawPrice).toBe("78/100");
    }
  });

  it('create FootBall cds for both temas to score homeSelectionTitle', () => {
    const bothTeamsToScore = service.getBothTeamToScoreData(footBallCdsMockdata.bothTeamsToScore);
    if (bothTeamsToScore) {
      expect(bothTeamsToScore?.selections?.[0]?.homeSelectionTitle).toBe("YES");
    }
  });

  it('create FootBall cds for both temas to score awaySelectionTitle', () => {
    const bothTeamsToScore = service.getBothTeamToScoreData(footBallCdsMockdata.bothTeamsToScore);
    if (bothTeamsToScore) {
      expect(bothTeamsToScore?.selections?.[0]?.awaySelectionTitle).toBe('NO ');
    }
  });

  it('create FootBall cds for both temas to score awayPrice', () => {
    const bothTeamsToScore = service.getBothTeamToScoreData(footBallCdsMockdata.bothTeamsToScore);
    if (bothTeamsToScore) {
      expect(bothTeamsToScore?.selections?.[0]?.awayPrice).toBe("1");
    }
  });

  it('create FootBall cds for both temas to score homePrice', () => {
    const bothTeamsToScore = service.getBothTeamToScoreData(footBallCdsMockdata.bothTeamsToScore);
    if (bothTeamsToScore) {
      expect(bothTeamsToScore?.selections?.[0]?.homePrice).toBe("68/100");
    }
  });

  it('create FootBall cds for matchResultBothTeamtoScore homeSelectionTitle', () => {
    const matchResultBothTeamtoScore = service.getMatchResultAndBothTeamToScoreData(footBallCdsMockdata.matchResultBothTeamtoScore);
    if (matchResultBothTeamtoScore) {
      expect(matchResultBothTeamtoScore?.selections?.[0]?.homeSelectionTitle).toBe("FRAM LARVIK");
    }
  });
  it('create FootBall cds for matchResultBothTeamtoScore awaySelectionTitle', () => {
    const matchResultBothTeamtoScore = service.getMatchResultAndBothTeamToScoreData(footBallCdsMockdata.matchResultBothTeamtoScore);
    if (matchResultBothTeamtoScore) {
      expect(matchResultBothTeamtoScore?.selections?.[0]?.awaySelectionTitle).toBe("LEVANGER");
    }
  });

  it('create FootBall cds for matchResultBothTeamtoScore homePrice', () => {
    const matchResultBothTeamtoScore = service.getMatchResultAndBothTeamToScoreData(footBallCdsMockdata.matchResultBothTeamtoScore);
    if (matchResultBothTeamtoScore) {
      expect(matchResultBothTeamtoScore?.selections?.[0]?.homePrice).toBe("27/4");
    }
  });
  it('create FootBall cds for matchResultBothTeamtoScore awayPrice', () => {
    const matchResultBothTeamtoScore = service.getMatchResultAndBothTeamToScoreData(footBallCdsMockdata.matchResultBothTeamtoScore);
    if (matchResultBothTeamtoScore) {
      expect(matchResultBothTeamtoScore?.selections?.[0]?.awayPrice).toBe("39/20");
    }
  });

  it('create FootBall cds for TotalGoals homeSelectionTitle', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.TotalScore1);
    if (TotalGoals) {
      expect(TotalGoals?.homePrice).toBe("19/100");
    }
  });
  it('create FootBall cds for TotalGoals name', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.TotalScore1);
    if (TotalGoals) {
      expect(TotalGoals?.name).toBe("1.5");
    }
  });

  it('create FootBall cds for TotalGoals homePrice', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.TotalScore1);
    if (TotalGoals) {
      expect(TotalGoals?.awayPrice).toBe("3");
    }
  });

  it('create FootBall cds for TotalGoals homeSelectionTitle', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totalScore2);
    if (TotalGoals) {
      expect(TotalGoals?.homePrice).toBe("3/5");
    }
  });
  it('create FootBall cds for TotalGoals name', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totalScore2);
    if (TotalGoals) {
      expect(TotalGoals?.name).toBe("2.5");
    }
  });

  it('create FootBall cds for TotalGoals homePrice', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totalScore2);
    if (TotalGoals) {
      expect(TotalGoals?.awayPrice).toBe("11/10");
    }
  });

  it('create FootBall cds for TotalGoals homeSelectionTitle', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totlaScore3);
    if (TotalGoals) {
      expect(TotalGoals?.homePrice).toBe("29/20");
    }
  });
  it('create FootBall cds for TotalGoals name', () => {
    const TotalGoals = service.getTotalGoals(footBallCdsMockdata.totlaScore3);
    if (TotalGoals) {
      expect(TotalGoals?.name).toBe("3.5");
    }
  });

  it('create FootBall cds for matchResult length', () => {
    const goalScorer = service.getFirstGoalScorer(footBallCdsMockdata.goalScorer)
    if (goalScorer) {
      expect(goalScorer?.selections?.length).toBe(7);
    }
  });

  it('create FootBall cds for 1st goalScorer homeSelectionTitle', () => {
    const goalScorer = service.getFirstGoalScorer(footBallCdsMockdata.goalScorer)
    if (goalScorer) {
      expect(goalScorer?.selections[0]?.homeSelectionTitle).toBe('ABOUD OMAR');
    }
  });

  it('create FootBall cds for 1st goalScorer homeprice', () => {
    const goalScorer = service.getFirstGoalScorer(footBallCdsMockdata.goalScorer)
    if (goalScorer) {
      expect(goalScorer?.selections[0]?.homePrice).toBe('78/100');
    }
  });

  it('create FootBall cds for 1st goalScorer awaySelectionTitle', () => {
    const goalScorer = service.getFirstGoalScorer(footBallCdsMockdata.goalScorer)
    if (goalScorer) {
      expect(goalScorer?.selections[0]?.awaySelectionTitle).toBe('MUGUNA, KENNETH');
    }
  });

  it('create FootBall cds for correctScorer awaySelectionTitle', () => {
    const correctScore = service.getCorrectScore(footBallCdsMockdata.correctScore)
    if (correctScore) {
      expect(correctScore?.selections.length).toBe(8);
    }
  });

  it('create FootBall cds for correctScorer homeSelectionTitle', () => {
    const correctScore = service.getCorrectScore(footBallCdsMockdata.correctScore)
    if (correctScore) {
      expect(correctScore?.selections?.[0]?.homeSelectionTitle).toEqual("1-0");
    }
  });

  it('create FootBall cds for correctScorer awaySelectionTitle', () => {
    const correctScore = service.getCorrectScore(footBallCdsMockdata.correctScore)
    if (correctScore) {
      expect(correctScore?.selections?.[0]?.awaySelectionTitle).toEqual("1-0");
    }
  });

  it('create FootBall cds for correctScorer awayPrice', () => {
    const correctScore = service.getCorrectScore(footBallCdsMockdata.correctScore)
    if (correctScore) {
      expect(correctScore?.selections?.[0]?.awayPrice).toEqual("6");
    }
  });

  it('create FootBall cds for correctScorer homePrice', () => {
    const correctScore = service.getCorrectScore(footBallCdsMockdata.correctScore)
    if (correctScore) {
      expect(correctScore?.selections?.[0]?.homePrice).toEqual("23/2");
    }
  });

});
