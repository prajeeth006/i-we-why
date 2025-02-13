import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockCorrectScoreData } from '../../../../mocks/mock-correct-score-data';
import { CorrectScoreComponent } from './correct-score.component';

describe('CorrectScoreComponent', () => {
  let component: CorrectScoreComponent;
  let fixture: ComponentFixture<CorrectScoreComponent>;
  let correctScoreDetailsMock: MockCorrectScoreData;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorrectScoreComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectScoreComponent);
    component = fixture.componentInstance;
    correctScoreDetailsMock = new MockCorrectScoreData();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('correct score market length ', () => {
    component.loadMultiMarketSelectionsData(correctScoreDetailsMock.marketDetailsObj);
    expect(component.drawBetList.size).toBe(4);
    expect(component.leftBetList.size).toBe(8);
    expect(component.rightBetList.size).toBe(8);
  });

  it('Correct Score match result market should set draw bet', () => {
    component.loadMultiMarketSelectionsData(correctScoreDetailsMock.marketDetailsObj);
    expect(component.drawBetList.get('0-0').betOdds).toBe("5/11");
    expect(component.drawBetList.get('1-1').betOdds).toBe("6/11");
  });

  it('correct score market should set Home betName and betodds', () => {
    component.loadMultiMarketSelectionsData(correctScoreDetailsMock.marketDetailsObj);
    expect(component.leftBetList.get('3-0').betOdds).toBe('4/12');
  });

  it('correct score market should set Away betName and betodds', () => {
    component.loadMultiMarketSelectionsData(correctScoreDetailsMock.marketDetailsObj);
    expect(component.rightBetList.get('3-0').betOdds).toBe('4/12');
  });

});
