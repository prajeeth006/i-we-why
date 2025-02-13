import { Injectable, inject } from '@angular/core';

import { IconsModel, IconsetConfig } from '@frontend/vanilla/features/icons';
import { Observable, map } from 'rxjs';

/**
 * @whatItDoes Provides functionality to fetch flags based on culture route value.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class FlagsService {
    private config = inject(IconsetConfig);

    /** Gets all available flags. */
    get available(): Observable<IconsModel[]> {
        return this.config.whenReady.pipe(
            map(() => {
                const flags = this.config.iconItems?.filter((x: any) => x.iconName.includes('-flag'));
                return flags.length > 0 ? flags : [];
            }),
        );
    }

    /** Finds flag image url by key. */
    find(routeValue: string) {
        return this.available.pipe(
            map((flags) => {
                const imageUrl = flags?.find((x: any) => x.iconName === `${routeValue}-flag`)?.imageUrl;
                return imageUrl ? imageUrl : '';
            }),
        );
    }
}
