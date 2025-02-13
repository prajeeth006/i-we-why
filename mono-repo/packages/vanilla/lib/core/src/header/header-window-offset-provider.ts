import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WindowOffsetProvider } from '../browser/window/window-offset-modifier.service';
import { HeaderService } from '../lazy/service-providers/header.service';

@Injectable()
export class HeaderWindowOffsetProvider implements WindowOffsetProvider {
    constructor(private headerService: HeaderService) {}

    getOffset(offset: number): Observable<number> {
        return this.headerService.whenReady.pipe(
            map(() => {
                const headerHeight = this.headerService.getHeaderHeight();
                return offset - headerHeight;
            }),
        );
    }
}
