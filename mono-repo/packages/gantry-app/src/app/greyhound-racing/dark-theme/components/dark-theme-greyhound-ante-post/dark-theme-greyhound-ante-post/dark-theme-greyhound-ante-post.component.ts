import { AfterContentChecked, ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { AntePostResult } from '../../../../../common/models/ante-post.model';
import { SelectionNameLength } from '../../../../../common/models/general-codes-model';
import { DarkThemeAntePostService } from '../../../../../common/services/dark-theme-ante-post.service';
import { ErrorService } from '../../../../../common/services/error.service';
import { RouteDataService } from '../../../../../common/services/route-data.service';
import { GreyhoundRacingContentService } from '../../../../components/greyhound-racing-template/services/greyhound-racing-content.service';
import { GreyhoundStaticContent } from '../../../../models/greyhound-racing-template.model';

@Component({
    selector: 'gn-dark-theme-greyhound-ante-post',
    templateUrl: './dark-theme-greyhound-ante-post.component.html',
    styleUrls: ['./dark-theme-greyhound-ante-post.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeGreyhoundAntePostComponent implements AfterContentChecked {
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

    greyHoundData$ = this.greyhoundRacingContentService.data$.pipe(
        tap((greyHoundData: GreyhoundStaticContent) => {
            console.log(greyHoundData);
        }),
        startWith({} as GreyhoundStaticContent), // Initial Value
    );

    vm$ = combineLatest([this.antePostResult$, this.greyHoundData$]).pipe(
        map(([antiPostResult, greyHoundData]) => {
            const preparedResult = this.prepareResult(antiPostResult, greyHoundData);
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

    prepareResult(antiPostResult: AntePostResult, greyHoundData: GreyhoundStaticContent) {
        if (!antiPostResult) return antiPostResult;
        antiPostResult.racingContent = greyHoundData;
        antiPostResult.selections =
            antiPostResult.selections?.filter((selection) => {
                selection.price = selection.hidePrice ? ' ' : selection.price;
                return !selection.hideEntry;
            }) ?? [];
        return antiPostResult;
    }

    constructor(
        private routeDataService: RouteDataService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
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
