import { Injectable } from '@angular/core';

import { ScreenType } from '../models/screen-size.model';

@Injectable({
    providedIn: 'root',
})
export class ScreenTypeService {
    isHalfScreenType = false;
    isFullScreenType = false;
    screenType: string = '';
    setScreenType(screenType: string) {
        this.screenType = screenType?.toLowerCase();
        if (this.screenType === ScreenType.half) {
            this.isHalfScreenType = true;
        } else if (this.screenType === ScreenType.full) {
            this.isFullScreenType = true;
        }
    }

    constructor() {}
}
