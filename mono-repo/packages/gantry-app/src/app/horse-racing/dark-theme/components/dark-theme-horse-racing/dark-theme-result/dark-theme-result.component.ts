import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';

import { StringHelper } from '../../../../../common/helpers/string.helper';
import { DarkThemeResultService } from './services/dark-theme-result.service';

@Component({
    selector: 'gn-dark-theme-result',
    templateUrl: './dark-theme-result.component.html',
    styleUrls: ['./dark-theme-result.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DarkThemeResultComponent {
    @Input() isHalfScreenType: boolean;
    showAbondendMessage: boolean = false;
    runnersLimit: number;
    maxDividends: number = 4;
    isForecastVerticalScroll: boolean;
    isTricastVerticalScroll: boolean;
    isWinVerticalScroll: boolean;
    isTotePlaceVerticalScroll: boolean;
    isToteExactaVerticalScroll: boolean;
    isToteTrifectaVerticalScroll: boolean;
    isVirtualRace: boolean;

    vm$ = this.darkThemeResultService.data$.pipe(
        map((result) => {
            this.runnersLimit = this.isHalfScreenType ? 7 : 6;
            this.isForecastVerticalScroll = StringHelper.shouldShowSeparator(result.foreCast, this.maxDividends);
            this.isTricastVerticalScroll = StringHelper.shouldShowSeparator(result.triCast, this.maxDividends);
            this.isWinVerticalScroll = StringHelper.shouldShowSeparator(result.win, this.maxDividends);
            this.isTotePlaceVerticalScroll = StringHelper.shouldShowSeparator(result.totePlaceDividends, this.maxDividends);
            this.isToteExactaVerticalScroll = StringHelper.shouldShowSeparator(result.totes.exacta, this.maxDividends);
            this.isToteTrifectaVerticalScroll = StringHelper.shouldShowSeparator(result.totes.trifecta, this.maxDividends);
            return result;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private darkThemeResultService: DarkThemeResultService) {
        this.isVirtualRace = this.darkThemeResultService.isVirtualRaceFlag;
    }
}
