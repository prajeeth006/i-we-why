import { Injectable } from '@angular/core';

import { CookieService } from '../../browser/cookie/cookie.service';
import { UserService } from '../../user/user.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslValueAsyncResolver, DslValueCacheKey } from '../dsl-value-async-resolver';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

const TERMINAL_DSL_INVALIDATE_KEY = 'Terminal';

@Injectable()
export class TerminalDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private dslValueAsyncResolver: DslValueAsyncResolver,
        private user: UserService,
        private cookieService: CookieService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Terminal: this.dslRecorderService
                .createRecordable('terminal')
                .createProperty({
                    name: 'AccountName',
                    get: () => this.getTerminalDetails()?.data?.customerAccount?.accountName ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'CustomerId',
                    get: () => this.getTerminalDetails()?.data?.customerAccount?.customerId ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IpAddress',
                    get: () => this.getTerminalDetails()?.data?.ipAddress ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'LockStatus',
                    get: () => this.getTerminalDetails()?.data?.lockStatus ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'MacId',
                    get: () => this.getTerminalDetails()?.data?.macId ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Resolution',
                    get: () => this.getTerminalDetails()?.data?.resolution ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Status',
                    get: () => this.getTerminalDetails()?.status ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'TerminalId',
                    get: () => this.cookieService.get('terminal_id') ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'TerminalStatus',
                    get: () => this.getTerminalDetails()?.data?.terminalStatus ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Type',
                    get: () => this.getTerminalDetails()?.data?.terminalType ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Volume',
                    get: () => this.getTerminalDetails()?.data?.volume?.toString() ?? '',
                    deps: [TERMINAL_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
                }),
        };
    }

    private getTerminalDetails(): any {
        if (this.user.isAuthenticated) {
            return this.dslValueAsyncResolver.resolve({
                cacheKey: DslValueCacheKey.TERMINAL,
                endpoint: 'terminal',
                invalidateKey: TERMINAL_DSL_INVALIDATE_KEY,
                get: (data) => data?.terminalDetails,
            });
        }

        return {};
    }
}
