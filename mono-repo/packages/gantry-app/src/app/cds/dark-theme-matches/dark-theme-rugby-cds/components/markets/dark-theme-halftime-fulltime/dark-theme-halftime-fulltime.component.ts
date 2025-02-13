import { Component, Input, OnChanges, SimpleChange } from '@angular/core';

import { SelectionNameLength } from '../../../../../../common/models/general-codes-model';
import { Game, RugbyCdsTemplateResult } from '../../../../../matches/rugby-cds/models/rugby-cds-template.model';

@Component({
    selector: 'gn-dark-theme-halftime-fulltime',
    templateUrl: './dark-theme-halftime-fulltime.component.html',
    styleUrls: ['./dark-theme-halftime-fulltime.component.scss'],
})
export class DarkThemeHalftimeFulltimeComponent implements OnChanges {
    constructor() {}

    @Input() market: RugbyCdsTemplateResult;
    nameLength = SelectionNameLength.Seventeen;
    gamesCount: number = 0;
    isHalfTimeFullTimeAvaiable: boolean = false;

    ngOnChanges(change: { [market: string]: SimpleChange }) {
        const marketDetails = change?.market?.currentValue;
        this.gamesCount = marketDetails?.games ? marketDetails?.games?.length : 0;
        this.isHalfTimeFullTimeAvaiable = marketDetails?.games?.filter((game: Game) => game?.isHalfFullBetting == true)?.length > 0 ? true : false;
    }
}
