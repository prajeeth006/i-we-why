import { AfterContentChecked, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith } from 'rxjs';

import { AntePostResult } from '../../../../../common/models/ante-post.model';
import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { DarkThemeAntePostService } from '../../../../../common/services/dark-theme-ante-post.service';
import { ErrorService } from '../../../../../common/services/error.service';
import { RouteDataService } from '../../../../../common/services/route-data.service';
import { HorseRacingContent } from '../../../../models/horseracing-content.model';
import { HorseRacingContentService } from '../../../../services/horseracing-content.service';

@Component({
    selector: 'gn-dark-theme-horse-ante-post',
    templateUrl: './dark-theme-horse-ante-post.component.html',
    styleUrls: ['./dark-theme-horse-ante-post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeHorseAntePostComponent implements AfterContentChecked {
    private eventId: string;
    private marketId: string;
    nameLength = SelectionNameLength.Eighteen;
    errorMessage$ = this.antiPostService.errorMessage$;
    private shouldSetError: boolean = false;

    antePostResult$ = this.antiPostService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        startWith({} as HorseRacingContent), // Initial value
    );

    vm$ = combineLatest([this.antePostResult$, this.horseRacingContent$]).pipe(
        map(([antiPostResult, horseRacingContent]) => {
            const preparedResult = this.prepareResult(antiPostResult, horseRacingContent);
            if (preparedResult.selections?.length === 0) {
                this.shouldSetError = true;
            } else {
                this.shouldSetError = false;
            }
            return preparedResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    prepareResult(antiPostResult: AntePostResult, horseRacingContent: HorseRacingContent) {
        if (!antiPostResult) return antiPostResult;
        antiPostResult.racingContent = horseRacingContent;
        antiPostResult.selections =
            antiPostResult.selections?.filter((selection) => {
                selection.price = selection.hidePrice ? ' ' : selection.price;
                return !selection.hideEntry;
            }) ?? [];
        return antiPostResult;
    }

    constructor(
        private routeDataService: RouteDataService,
        private horseRacingContent: HorseRacingContentService,
        private antiPostService: DarkThemeAntePostService,
        private errorService: ErrorService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        this.eventId = queryParams['eventId'];
        this.marketId = queryParams['marketId'];
        antiPostService.setEventMarketsList(this.eventId, this.marketId);
    }
    ngAfterContentChecked() {
        if (this.shouldSetError) {
            this.errorService.setError(location.href);
        } else {
            this.errorService.unSetError();
        }
    }
}
