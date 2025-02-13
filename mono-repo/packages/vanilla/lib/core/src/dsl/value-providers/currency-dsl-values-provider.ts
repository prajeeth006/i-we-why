import { Injectable } from '@angular/core';

import { IntlService } from '../../intl/intl.service';
import { UserService } from '../../user/user.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class CurrencyDslValuesProvider implements DslValuesProvider {
    constructor(
        private readonly dslRecorderService: DslRecorderService,
        private readonly intlService: IntlService,
        private readonly user: UserService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService
            .createRecordable('currency')
            .createProperty({ name: 'Symbol', get: () => this.intlService.getCurrencySymbol(), deps: ['user.currency', 'user.isAuthenticated'] })
            .createFunction({
                name: 'Format',
                get: (args: string) => {
                    try {
                        if (!isNaN(Number(args))) {
                            return this.intlService.formatCurrency(Number(args));
                        }
                        const values = args.split(',').map((cp: string) => {
                            const currencyValues = cp.split('|');

                            return { currencyCode: currencyValues[0]?.trim(), amount: Number(currencyValues[1]?.trim()) };
                        });

                        const userValue = values.find((x) => x.currencyCode == this.user.currency);

                        if (!userValue) {
                            throw new Error(`User Currency (${this.user.currency})value not found in list: ${args}`);
                        }

                        return this.intlService.formatCurrency(userValue.amount);
                    } catch (error) {
                        throw new Error(`Currency DSL failed with error ${error} .DSL args: ${args}`);
                    }
                },
                deps: ['user.currency', 'user.isAuthenticated'],
            });

        return { Currency: recordable };
    }
}
