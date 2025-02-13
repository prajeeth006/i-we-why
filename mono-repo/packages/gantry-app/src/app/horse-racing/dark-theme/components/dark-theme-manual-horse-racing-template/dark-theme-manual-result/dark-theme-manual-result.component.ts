import { AfterViewInit, Component } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';

import { StringHelper } from '../../../../../common/helpers/string.helper';
import { FavouriteTags } from '../../../../../common/models/racing-tags.model';
import { ScreenTypeService } from '../../../../../common/services/screen-type.service';
import { ManualHorseRacingResults } from '../../../../models/horse-racing-manual-template.model';
import { DarkThemeManualHorseRacingResultService } from './services/dark-theme-manual-horse-racing-result.service';

@Component({
    selector: 'gn-dark-manual-result',
    templateUrl: './dark-theme-manual-result.component.html',
    styleUrls: ['./dark-theme-manual-result.component.scss'],
})
export class DarkThemeManualResultComponent implements AfterViewInit {
    favouriteTags = FavouriteTags;
    isHalfScreenType = false;
    runnersLimit: number;
    maxDividends: number = 4;
    isForecastVerticalScroll: boolean;
    isTricastVerticalScroll: boolean;
    isWinVerticalScroll: boolean;
    isPlaceVerticalScroll: boolean;
    isToteExactaVerticalScroll: boolean;
    isToteTrifectaVerticalScroll: boolean;

    vm$ = this.horseRacingResultService.data$.pipe(
        map((result: ManualHorseRacingResults) => {
            this.runnersLimit = this.isHalfScreenType ? 7 : 6;
            this.isForecastVerticalScroll = StringHelper.shouldShowSeparator(result.foreCast, this.maxDividends);
            this.isTricastVerticalScroll = StringHelper.shouldShowSeparator(result.triCast, this.maxDividends);
            this.isWinVerticalScroll = StringHelper.shouldShowSeparator(result.win, this.maxDividends);
            this.isPlaceVerticalScroll = StringHelper.shouldShowSeparator(result.place, this.maxDividends);
            this.isToteExactaVerticalScroll = StringHelper.shouldShowSeparator(result.totes.exacta, this.maxDividends);
            this.isToteTrifectaVerticalScroll = StringHelper.shouldShowSeparator(result.totes.trifecta, this.maxDividends);
            return result;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private horseRacingResultService: DarkThemeManualHorseRacingResultService,
        private screenTypeService: ScreenTypeService,
    ) {}

    ngAfterViewInit() {
        this.isHalfScreenType = this.screenTypeService.isHalfScreenType;
    }
}
