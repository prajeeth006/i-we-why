import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { CricketCdsTemplateModel } from '../../../../../../../app/cds/common/models/cricket-cds-template.model';
import { MarketDetails } from '../../../../../../../app/cds/common/models/sport-cds-template.model';
import { SelectionStatus } from '../../../../../../common/models/general-codes-model';
import { DarkThemeCommonMatches } from '../../../../common/models/dark-theme-commom-matches.model';

@Component({
    selector: 'gn-dark-match-betting',
    templateUrl: './dark-theme-match-betting.component.html',
    styleUrls: ['./dark-theme-match-betting.component.scss'],
})
export class DarkThemeMatchBettingComponent implements OnChanges {
    @Input() matchData: CricketCdsTemplateModel;
    selectionData: DarkThemeCommonMatches = new DarkThemeCommonMatches();
    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        const marketDetails = change?.matchData?.currentValue as CricketCdsTemplateModel;
        this.selectionData = {} as DarkThemeCommonMatches;
        if (!!marketDetails?.gameInfo?.markets?.matchBetting) {
            let market: MarketDetails = marketDetails?.gameInfo?.markets?.matchBetting;
            const gameFlags = marketDetails?.gameInfo?.gameFlags;
            const marketSelections = market?.marketSelections;

            if (!!market && !!market?.marketSelections) {
                this.selectionData.homeSelectionTitle = marketSelections?.home?.betName;
                this.selectionData.homePrice = marketSelections?.home?.betOdds;
                this.selectionData.awaySelectionTitle = marketSelections?.away?.betName;
                this.selectionData.awayPrice = marketSelections?.away?.betOdds;
                this.selectionData.drawTitle = gameFlags?.isTestMatch ? marketSelections?.draw?.betName : '';
                this.selectionData.drawPrice = gameFlags?.isTestMatch ? marketSelections?.draw?.betOdds : '';
                this.selectionData.drawSuspended = marketSelections?.draw?.status?.toLowerCase() == SelectionStatus?.Suspended?.toLowerCase();
                this.selectionData.drawMarketAvailable = true;
                this.selectionData.title = gameFlags?.isTestMatch
                    ? market?.drawTitle
                    : gameFlags?.isSuperOver
                      ? (marketDetails?.content?.contentParameters?.SuperOver ?? '')
                      : (marketDetails?.content?.contentParameters?.MatchBetting ?? '');
                this.selectionData.trimTitleRequired = true;
                this.selectionData.marketVersesName = gameFlags?.isTestMatch ? '' : (marketDetails?.content?.contentParameters?.Vs ?? '');
            }
        }
    }

    constructor() {}
}
