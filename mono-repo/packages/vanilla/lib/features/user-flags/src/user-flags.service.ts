import { Injectable } from '@angular/core';

import { RtmsService, RtmsType, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';

import { UserFlag, UserFlagsResponse } from './user-flags.models';

/**
 * @whatItDoes Provide an observable - `flags` with up-to-date data.
 *
 * @howToUse
 * ```
 * this.userFlagsService.flags.subscribe((userFlags: UserFlag[] | null) => { ... });
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class UserFlagsService {
    /** Observable of user flags. Will instantly return current value to subscribers - null if not loaded. */
    get flags(): Observable<UserFlag[] | null> {
        return this.userFlagsEvents;
    }

    private userFlags: UserFlag[];
    private userFlagsLoadInProgress: boolean = false;
    private userFlagsEvents = new ReplaySubject<UserFlag[] | null>(1);

    constructor(
        private apiService: SharedFeaturesApiService,
        private rtmsService: RtmsService,
    ) {
        this.userFlagsEvents.next(null);
    }

    load() {
        if (!this.userFlagsLoadInProgress) {
            this.userFlagsLoadInProgress = true;

            this.apiService
                .get('userflags')
                .pipe(first())
                .subscribe((response) => {
                    this.userFlags = response.userFlags;
                    this.initRtmsMessage();
                    this.emitUserFlags();
                });
        }
    }

    private emitUserFlags() {
        this.userFlagsEvents.next(this.userFlags);
    }

    private initRtmsMessage() {
        this.rtmsService.messages
            .pipe(
                filter((message) => message.type === RtmsType.UPDATE_CRM_FLAG_EVENT),
                map((m) => m.payload as UserFlagsResponse),
                map((m) => m.flags),
            )
            .subscribe((updatedUserFlags: UserFlag[]) => {
                if (updatedUserFlags && updatedUserFlags.length) {
                    this.userFlags = this.userFlags
                        .filter(
                            (currentFlag) => !updatedUserFlags.find((nextFlag) => currentFlag.name?.toLowerCase() === nextFlag.name?.toLowerCase()),
                        )
                        .concat(updatedUserFlags);

                    this.apiService.get('userflags/invalidatecache').pipe(first()).subscribe();
                    this.emitUserFlags();
                }
            });
    }
}
