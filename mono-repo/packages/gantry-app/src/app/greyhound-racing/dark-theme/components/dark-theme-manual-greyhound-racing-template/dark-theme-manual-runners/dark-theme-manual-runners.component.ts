import { Component } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';

import { DarkThemeMarketStatus } from '../../../../../common/models/general-codes-model';
import { DarkThemeManualGreyhoundRacingTemplateService } from '../services/dark-theme-manual-greyhound-racing-template.service';

@Component({
    selector: 'gn-dark-theme-manual-runners',
    templateUrl: './dark-theme-manual-runners.component.html',
    styleUrls: ['./dark-theme-manual-runners.component.scss'],
})
export class DarkThemeManualRunnersComponent {
    suspendedMarketStatus = DarkThemeMarketStatus.Suspended;

    vm$ = this.darkThemeManualGreyhoundRacingTemplateService.data$.pipe(
        map((result) => {
            return result.manualGreyhoundRacingRunners;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private darkThemeManualGreyhoundRacingTemplateService: DarkThemeManualGreyhoundRacingTemplateService) {}
}
