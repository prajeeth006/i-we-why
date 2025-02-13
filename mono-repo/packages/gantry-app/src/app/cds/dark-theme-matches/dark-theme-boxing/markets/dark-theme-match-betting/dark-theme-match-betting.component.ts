import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { BoxingCdsContent } from '../../../../matches/boxing-cds/models/boxing-cds-content.model';
import { DarkThemeCommonMatches } from '../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-theme-match-betting',
    templateUrl: './dark-theme-match-betting.component.html',
    styleUrls: ['./dark-theme-match-betting.component.scss'],
})
export class DarkThemeMatchBettingComponent implements OnChanges {
    @Input() matchData: BoxingCdsContent;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as BoxingCdsContent;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (marketDetails?.finalResult?.selections && marketDetails.finalResult.selections[0]?.drawPrice !== '') {
            this.selectionData.title = marketDetails?.content?.contentParameters?.Draw || '';
        } else if (marketDetails?.finalResult?.selections?.length) {
            this.selectionData.title = ''; // You can set it to an empty string or handle it as needed
        }
        if (marketDetails?.finalResult?.selections && marketDetails?.finalResult?.selections?.length) {
            this.selectionData.homePrice = marketDetails?.finalResult?.selections[0]?.homePrice;
            this.selectionData.homeSelectionTitle = marketDetails?.finalResult?.selections[0]?.homeSelectionTitle;
            this.selectionData.awayPrice = marketDetails?.finalResult?.selections[0]?.awayPrice;
            this.selectionData.awaySelectionTitle = marketDetails?.finalResult?.selections[0]?.awaySelectionTitle;
            this.selectionData.drawTitle = marketDetails?.finalResult?.selections[0]?.drawTitle;
            this.selectionData.drawPrice = marketDetails?.finalResult?.selections[0]?.drawPrice;
            this.selectionData.drawMarketAvailable = true;
            this.selectionData.trimTitleRequired = true;
        }
    }
    constructor() {}
}
