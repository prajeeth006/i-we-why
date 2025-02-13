import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ManualGreyhoundRacingTemplateService } from '../../services/manual-greyhound-racing-template.service';

@Component({
    selector: 'gn-manual-runners',
    templateUrl: './manual-runners.component.html',
    styleUrls: ['./manual-runners.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualRunnersComponent {
    vm$ = this.manualGreyhoundRacingTemplateService.data$.pipe(
        map((result) => {
            return result.manualGreyhoundRacingRunners;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private manualGreyhoundRacingTemplateService: ManualGreyhoundRacingTemplateService) {}
}
