import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { CricketTemplateResult, MatchData } from 'src/app/cricket/models/cricket-template.model';

@Component({
  selector: 'gn-total-sixes',
  templateUrl: './total-sixes.component.html',
  styleUrls: ['./total-sixes.component.scss']
})
export class TotalSixesComponent implements OnInit {
  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as CricketTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.cricketContent.contentParameters.TotalSixes;
      this.multiMarket.selections = [];

      if (marketDetails?.totalSixes?.homeTeamDetails != null || marketDetails?.totalSixes?.awayTeamDetails != null)
        if (!marketDetails?.totalSixes?.homeTeamDetails?.hideEntry || !marketDetails?.totalSixes?.awayTeamDetails?.hideEntry) {
          this.multiMarket.selections.push({
            homePrice: marketDetails?.totalSixes?.homeTeamDetails?.betOdds,
            hideHomePrice: marketDetails?.totalSixes?.homeTeamDetails?.hideOdds,
            homeSelectionTitle: marketDetails?.totalSixes?.homeTeamDetails?.betName,
            hideHomeTitle: marketDetails?.totalSixes?.homeTeamDetails?.hideEntry,
            awayPrice: marketDetails?.totalSixes?.awayTeamDetails?.betOdds,
            hideAwayPrice: marketDetails?.totalSixes?.awayTeamDetails?.hideOdds,
            awaySelectionTitle: marketDetails?.totalSixes?.awayTeamDetails?.betName,
            hideAwayTitle: marketDetails?.totalSixes?.awayTeamDetails?.hideEntry,
          })
        }
    }


  }
  constructor() { }

  ngOnInit(): void {
  }

}
