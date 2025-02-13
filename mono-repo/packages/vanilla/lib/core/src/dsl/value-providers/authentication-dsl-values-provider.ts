import { Injectable } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class AuthenticationDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private authService: AuthService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Authentication: this.dslRecorderService.createRecordable('authentication').createAction({
                name: 'Logout',
                fn: () => this.authService.logout({ redirectAfterLogout: false }),
            }),
        };
    }
}
