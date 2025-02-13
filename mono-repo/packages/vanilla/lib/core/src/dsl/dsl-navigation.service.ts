import { Injectable, NgZone } from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ImmutableParsedUrl } from '../navigation/immutable-parsed-url';
import { NavigationService } from '../navigation/navigation.service';
import { ParsedUrl } from '../navigation/parsed-url';

/**
 * @whatItDoes Provides a way to change url from DSL.
 *
 * When redirect is enqueued from a DSL provider `location` is updated to reflect and subsequent DSL providers take values from it.
 * After current execution is completed, the page is navigated to the last enqueued url.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DslNavigationService {
    get location(): ImmutableParsedUrl {
        return this.readOnlyUrl;
    }

    private url: ParsedUrl | null;
    private readOnlyUrl: ImmutableParsedUrl;
    private redirectStream = new Subject();

    constructor(
        private navigationService: NavigationService,
        private zone: NgZone,
    ) {
        this.readOnlyUrl = this.navigationService.location;
        this.navigationService.locationChange.subscribe(() => {
            if (!this.url) {
                this.readOnlyUrl = this.navigationService.location;
            }
        });

        this.redirectStream.pipe(debounceTime(0)).subscribe(() => {
            if (this.url) {
                this.zone.run(() => this.navigationService.goTo(this.url!, { replace: true }));
                this.url = null;
            }
        });
    }

    enqueueRedirect(url: ParsedUrl) {
        this.url = url;
        this.readOnlyUrl = new ImmutableParsedUrl(url);
        this.redirectStream.next(null);
    }
}
