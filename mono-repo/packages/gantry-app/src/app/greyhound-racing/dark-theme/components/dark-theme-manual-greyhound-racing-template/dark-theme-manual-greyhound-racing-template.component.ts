import { Component } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { DarkThemeManualGreyhoundRacingTemplateService } from './services/dark-theme-manual-greyhound-racing-template.service';

@Component({
    selector: 'gn-dark-theme-manual-greyhound-racing-template',
    templateUrl: './dark-theme-manual-greyhound-racing-template.component.html',
    styleUrls: ['./dark-theme-manual-greyhound-racing-template.component.scss'],
})
export class DarkThemeManualGreyhoundRacingTemplateComponent {
    errorMessage$ = this.darkThemeManualGreyhoundRacingTemplateService.errorMessage$;

    vm$ = this.darkThemeManualGreyhoundRacingTemplateService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private darkThemeManualGreyhoundRacingTemplateService: DarkThemeManualGreyhoundRacingTemplateService) {}
}
