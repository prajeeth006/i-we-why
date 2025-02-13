import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { CricketTemplateResult, MatchData } from 'src/app/cricket/models/cricket-template.model';

@Component({
  selector: 'gn-towin-the-toss',
  templateUrl: './towin-the-toss.component.html',
  styleUrls: ['./towin-the-toss.component.scss']
})
export class TowinTheTossComponent implements OnInit {

  @Input() matchData: MatchData;
  multiMarket: MultiMarket = new MultiMarket();

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    let marketDetails = change?.matchData?.currentValue as CricketTemplateResult;
    if (marketDetails) {
      this.multiMarket.title = marketDetails.cricketContent.contentParameters.ToWinTheToss;
      this.multiMarket.selections = [];

      if (marketDetails?.tossOrLeadInfoPanel?.homeTeamDetails != null || marketDetails?.tossOrLeadInfoPanel?.awayTeamDetails != null)
        if (!marketDetails?.tossOrLeadInfoPanel?.homeTeamDetails?.hideEntry || !marketDetails?.tossOrLeadInfoPanel?.awayTeamDetails?.hideEntry) {
          this.multiMarket.selections.push({
            homePrice: marketDetails?.tossOrLeadInfoPanel?.homeTeamDetails?.betOdds,
            hideHomePrice: marketDetails?.tossOrLeadInfoPanel?.homeTeamDetails?.hideOdds,
            homeSelectionTitle: marketDetails?.tossOrLeadInfoPanel?.homeTeamDetails?.betName,
            hideHomeTitle: marketDetails?.tossOrLeadInfoPanel?.homeTeamDetails?.hideEntry,
            awayPrice: marketDetails?.tossOrLeadInfoPanel?.awayTeamDetails?.betOdds,
            hideAwayPrice: marketDetails?.tossOrLeadInfoPanel?.awayTeamDetails?.hideOdds,
            awaySelectionTitle: marketDetails?.tossOrLeadInfoPanel?.awayTeamDetails?.betName,
            hideAwayTitle: marketDetails?.tossOrLeadInfoPanel?.awayTeamDetails?.hideEntry,
          })
        }

    }


  }
  constructor() { }

  ngOnInit(): void {
  }

}
