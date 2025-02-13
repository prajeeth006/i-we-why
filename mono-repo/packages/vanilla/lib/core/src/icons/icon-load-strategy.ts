import { Injectable, inject } from '@angular/core';

import { SvgLoadStrategyImpl } from '@push-based/ngx-fast-svg';
import { Observable, of, switchMap } from 'rxjs';

import { IconFastCoreService } from '../lazy/service-providers/icon-fast-core.service';

@Injectable({ providedIn: 'root' })
export class IconLoadStrategy extends SvgLoadStrategyImpl {
    iconFastCoreService = inject(IconFastCoreService);

    override config(url: string): Observable<string> {
        return this.iconFastCoreService.whenReady.pipe(switchMap(() => of(this.iconFastCoreService.getIconParameter(url, 'urlId') || url)));
    }
}
