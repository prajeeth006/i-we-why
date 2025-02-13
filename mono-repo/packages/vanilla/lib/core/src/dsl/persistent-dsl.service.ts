import { Injectable } from '@angular/core';

import { first } from 'rxjs/operators';

import { UserEvent, UserLoginEvent } from '../user/user-events';
import { UserService } from '../user/user.service';
import { DSL_NOT_READY } from './dsl-recorder.service';

export class PersistentDslLoadOptions {
    fetchEnabled: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class PersistentDslService {
    constructor(private user: UserService) {}

    getResult<T>(options: PersistentDslLoadOptions, fetchFunc: () => void, resultFunc: () => T | any): any {
        if (options.fetchEnabled) {
            options.fetchEnabled = false;
            fetchFunc();

            this.user.events.pipe(first((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => {
                fetchFunc();
            });
        }

        return resultFunc() ?? DSL_NOT_READY;
    }
}
