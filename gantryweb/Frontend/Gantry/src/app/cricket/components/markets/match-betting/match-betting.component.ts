import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { MatchData } from 'src/app/cricket/models/cricket-template.model';

@Component({
  selector: 'gn-match-betting',
  templateUrl: './match-betting.component.html',
  styleUrls: ['./match-betting.component.scss']
})
export class MatchBettingComponent implements OnInit {


  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    let marketDetails = change?.matchData?.currentValue as MatchData;
    this.multiMarket.title = marketDetails?.drawMatchDetails ? marketDetails?.drawMatchDetails?.betName : marketDetails?.marketName;
    this.multiMarket.marketVersesName = marketDetails?.marketVersesName;
    this.multiMarket.selections = [];

    if (marketDetails?.homeTeamDetails != null || marketDetails?.awayTeamDetails != null || marketDetails?.drawMatchDetails != null)
      if (!marketDetails?.homeTeamDetails?.hideEntry || !marketDetails?.awayTeamDetails?.hideEntry) {
        Array.from({ length: 1 }).map((x, i) => {
          this.multiMarket.selections.push({
            homePrice: marketDetails.homeTeamDetails?.betOdds,
            hideHomePrice: marketDetails.homeTeamDetails?.hideOdds,
            homeSelectionTitle: marketDetails.homeTeamDetails?.betName,
            hideHomeTitle: marketDetails.homeTeamDetails?.hideEntry,
            drawPrice: marketDetails.drawMatchDetails?.betOdds,
            hideDrawPrice: marketDetails.drawMatchDetails?.hideOdds,
            awayPrice: marketDetails.awayTeamDetails?.betOdds,
            hideAwayPrice: marketDetails.awayTeamDetails?.hideOdds,
            awaySelectionTitle: marketDetails.awayTeamDetails?.betName,
            hideAwayTitle: marketDetails.awayTeamDetails?.hideEntry,
          })
        });
      }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
