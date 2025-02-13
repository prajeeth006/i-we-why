import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { MatchData } from 'src/app/dart/models/dart-template.model';

@Component({
  selector: 'gn-match-one-on-one',
  templateUrl: './match-one-on-one.component.html',
  styleUrls: ['./match-one-on-one.component.scss']
})
export class MatchOneOnOneComponent implements OnInit {

  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {

    let marketDetails = change?.matchData?.currentValue as MatchData;
    if (marketDetails) {
      this.multiMarket.title = marketDetails?.marketName;
      this.multiMarket.selections = [];
      this.multiMarket.trimValue = !marketDetails?.isHandicapValue;

      if (marketDetails.homeTeamDetails != null || marketDetails?.awayTeamDetails != null)
        Array.from({ length: 1 }).map((x, i) => {
          if (marketDetails.homeTeamDetails || marketDetails.awayTeamDetails)
            if (!marketDetails.homeTeamDetails?.hideEntry || !marketDetails.awayTeamDetails?.hideEntry) {
              this.multiMarket.selections.push({
                homePrice: marketDetails.homeTeamDetails?.betOdds,
                hideHomePrice: marketDetails.homeTeamDetails?.hideOdds,
                homeSelectionTitle: marketDetails.homeTeamDetails?.betName,
                hideHomeTitle: marketDetails.homeTeamDetails?.hideEntry,
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
