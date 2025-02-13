import { Component } from '@angular/core';

import { EMPTY, catchError, map } from 'rxjs';

import { GreyhoundRacingResultPage } from '../../../../models/greyhound-racing-template.model';
import { DarkThemeGreyhoundRacingResultService } from './services/dark-theme-greyhound-racing-result.service';

@Component({
    selector: 'gn-dark-theme-result',
    templateUrl: './dark-theme-result.component.html',
    styleUrls: ['./dark-theme-result.component.scss'],
})
export class DarkThemeResultComponent {
    vm$ = this.darkThemegreyhoundRacingResultService.data$.pipe(
        map((result: GreyhoundRacingResultPage) => {
            return result;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private darkThemegreyhoundRacingResultService: DarkThemeGreyhoundRacingResultService) {}
}
