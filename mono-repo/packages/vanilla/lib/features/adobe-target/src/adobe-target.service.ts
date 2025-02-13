import { Injectable } from '@angular/core';

import { ContentService, Logger } from '@frontend/vanilla/core';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AdobeTargetBackendService } from './adobe-target-backend.service';
import { AdobeTargetOptions, AdobeTargetResponse } from './adobe-target.models';

/**
 * @whatItDoes Provides integration with adobe target.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class AdobeTargetService {
    constructor(
        private adobeTargetBackendService: AdobeTargetBackendService,
        private contentService: ContentService,
        private logger: Logger,
    ) {}

    /** Returns sitecore content of target offer. Returns null if it fails. */
    getOffer(options: AdobeTargetOptions): Observable<unknown> {
        return this.adobeTargetBackendService.getOffer(options).pipe(
            map((response: AdobeTargetResponse): string | null => {
                try {
                    return response.offer[0]!.content[0]!.path;
                } catch {
                    this.logger.errorRemote('Failed extracting path from adobe target response.', response);

                    return null;
                }
            }),
            filter((path: string | null): path is string => path != null),
            switchMap((path: string) => this.contentService.getJsonFiltered(path)),
            catchError(() => of(null)),
        );
    }
}
