import { Component } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';

import { DarkThemeMarketStatus, SelectionSuspended } from '../../../../../common/models/general-codes-model';
import { DarkThemeGreyhoundRacingTemplateService } from '../services/dark-theme-greyhound-racing-template.service';

@Component({
    selector: 'gn-dark-theme-runners',
    templateUrl: './dark-theme-runners.component.html',
    styleUrls: ['./dark-theme-runners.component.scss'],
})
export class DarkThemeRunnersComponent {
    isEventResulted: boolean = false;
    selectionAndPrice = SelectionSuspended.selectionAndPrice;
    suspendedMarketStatus = DarkThemeMarketStatus.Suspended;

    vm$ = this.darkThemeGreyhoundRacingTemplateService.data$.pipe(
        map((result) => {
            this.isEventResulted = result.isAnyEventResulted;
            if (result.greyhoundRacingRunnersResult && !result?.greyhoundRacingRunnersResult?.isVirtualEvent) {
                result.greyhoundRacingRunnersResult.greyhoundRacingEntries = result.greyhoundRacingRunnersResult.greyhoundRacingEntries.filter(
                    (runner) => {
                        let notToRemove = false;
                        Object.keys(runner.hideEntry).map((key) => {
                            if (runner.hideEntry[key] != true && runner.hideEntry[key] != undefined) {
                                notToRemove = true;
                            }
                        });
                        return notToRemove;
                    },
                );
            }

            return result.greyhoundRacingRunnersResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private darkThemeGreyhoundRacingTemplateService: DarkThemeGreyhoundRacingTemplateService) {}
}
