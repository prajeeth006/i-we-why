import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { UserFlag } from './user-flags.models';
import { UserFlagsService } from './user-flags.service';

@Injectable()
export class UserFlagsDslValuesProvider implements DslValuesProvider {
    private userFlags: UserFlag[] | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private userFlagsServices: UserFlagsService,
        private user: UserService,
    ) {
        this.userFlagsServices.flags.subscribe((s) => {
            this.userFlags = s;
            this.loaded = true;
            dslCacheService.invalidate(['userFlags.Get', 'userFlags.HasReasonCode']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            UserFlags: this.dslRecorderService
                .createRecordable('userFlags')
                .createFunction({
                    name: 'Get',
                    get: (name: string) =>
                        this.getCurrentValue<string>('', () =>
                            this.userFlags ? this.userFlags.find((s) => s.name?.toLowerCase() === name?.toLowerCase())?.value || '' : DSL_NOT_READY,
                        ),
                    deps: ['userFlags.Get', 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'HasReasonCode',
                    get: (reasonCodes: string) =>
                        this.getCurrentValue<boolean>(false, () => {
                            if (!this.userFlags) {
                                return DSL_NOT_READY;
                            }

                            const codes = reasonCodes?.split(',').map((code) => code.trim().toLowerCase());

                            const userReasonCodes = this.userFlags.map((flag) => flag.reasonCodes).reduce((a, b) => a?.concat(b || []));

                            const hasReasonCode = userReasonCodes?.some((code) => codes?.includes(code.toLowerCase()));

                            return !!hasReasonCode;
                        }),
                    deps: ['userFlags.HasReasonCode', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue<T>(defaultValue: string | boolean, get: () => T) {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.userFlagsServices.load();
        }

        return get();
    }
}
