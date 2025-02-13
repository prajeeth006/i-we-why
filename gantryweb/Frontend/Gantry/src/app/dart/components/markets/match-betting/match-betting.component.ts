import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { MatchData } from 'src/app/dart/models/dart-template.model';

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
    if (marketDetails) {
      this.multiMarket.title = marketDetails?.marketName;
      this.multiMarket.marketVersesName = marketDetails?.marketVersesName;
      this.multiMarket.selections = [];

      if (marketDetails.homeTeamDetails != null || marketDetails?.awayTeamDetails != null || marketDetails?.drawDetails != null)
        Array.from({ length: 1 }).map((x, i) => {
          if (marketDetails.homeTeamDetails || marketDetails.awayTeamDetails || marketDetails.drawDetails)
            if (!marketDetails.homeTeamDetails?.hideEntry || !marketDetails.awayTeamDetails?.hideEntry) {
              this.multiMarket.selections.push({
                homePrice: marketDetails.homeTeamDetails?.betOdds,
                homeSelectionTitle: marketDetails.homeTeamDetails?.betName,
                hideHomePrice: marketDetails.homeTeamDetails?.hideOdds,
                hideHomeTitle: marketDetails.homeTeamDetails?.hideEntry,
                drawPrice: marketDetails.drawDetails?.betOdds,
                hideDrawPrice: marketDetails.drawDetails?.hideOdds,
                awayPrice: marketDetails.awayTeamDetails?.betOdds,
                hideAwayPrice: marketDetails.awayTeamDetails?.hideOdds,
                awaySelectionTitle: marketDetails.awayTeamDetails?.betName,
                hideAwayTitle: marketDetails.awayTeamDetails?.hideEntry,
              })
            }

        });
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
