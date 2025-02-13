import { Component } from '@angular/core';

import { EMPTY, catchError, tap } from 'rxjs';

import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { ManualOutrightTemplateService } from '../../../outright/services/manual-outright-template.service';

@Component({
    selector: 'gn-dark-theme-manual-outright-template',
    templateUrl: './dark-theme-manual-outright-template.component.html',
    styleUrls: ['./dark-theme-manual-outright-template.component.scss'],
})
export class DarkThemeManualOutrightTemplateComponent {
    nameLength = SelectionNameLength.Seventeen;
    unrestrictedNameLength = SelectionNameLength.Unrestricted;
    errorMessage$ = this.manualOutrightTemplateService.errorMessage$;

    vm$ = this.manualOutrightTemplateService.data$.pipe(
        tap(() => {}),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(private manualOutrightTemplateService: ManualOutrightTemplateService) {}
}
