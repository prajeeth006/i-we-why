import { Component } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';

import { FavouriteTags } from '../../../../../common/models/racing-tags.model';
import { DarkThemeManualGreyhoundRacingTemplateService } from '../services/dark-theme-manual-greyhound-racing-template.service';

@Component({
    selector: 'gn-dark-theme-manual-results',
    templateUrl: './dark-theme-manual-results.component.html',
    styleUrls: ['./dark-theme-manual-results.component.scss'],
})
export class DarkThemeManualResultsComponent {
    favouriteTags = FavouriteTags;

    vm$ = this.darkThemeManualGreyhoundRacingTemplateService.data$.pipe(
        map((result) => {
            return result.manualGreyhoundRacingResults;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private darkThemeManualGreyhoundRacingTemplateService: DarkThemeManualGreyhoundRacingTemplateService) {}
}
