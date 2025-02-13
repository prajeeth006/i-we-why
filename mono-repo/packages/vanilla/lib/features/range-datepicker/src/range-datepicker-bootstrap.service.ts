import { Injectable, inject } from '@angular/core';

import { MenuAction, MenuActionsService, OnFeatureInit } from '@frontend/vanilla/core';

import { RangeDatepickerOverlayService } from './range-datepicker-overlay.service';
import { RangeDatepickerOptions } from './range-datepicker.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RangeDatepickerBootstrapService implements OnFeatureInit {
    private rangeDatepickerService = inject(RangeDatepickerOverlayService);
    private menuActionsService = inject(MenuActionsService);

    onFeatureInit() {
        this.menuActionsService.register(MenuAction.TOGGLE_RANGE_DATEPICKER, (_: string, options: RangeDatepickerOptions[] = []) => {
            this.rangeDatepickerService.toggleRangeDatepicker(options[0]);
        });
    }
}
