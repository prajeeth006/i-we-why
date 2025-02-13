import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError } from 'rxjs';

import { DarkThemeManualHorseRacingTemplateService } from './services/dark-theme-manual-horse-racing-template.service';

@Component({
    selector: 'gn-dark-manual-horse-racing-template',
    templateUrl: './dark-theme-manual-horse-racing-template.component.html',
    styleUrls: ['./dark-theme-manual-horse-racing-template.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeManualHorseRacingTemplateComponent {
    errorMessage$ = this.manualHorseRacingTemplateService.errorMessage$;

    vm$ = this.manualHorseRacingTemplateService.data$.pipe(
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private manualHorseRacingTemplateService: DarkThemeManualHorseRacingTemplateService) {}
}
