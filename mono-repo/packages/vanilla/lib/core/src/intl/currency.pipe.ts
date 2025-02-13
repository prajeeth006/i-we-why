import { Pipe, PipeTransform } from '@angular/core';

import { IntlService } from './intl.service';

/**
 * @whatItDoes Transforms a number into a currency string
 *
 * @howToUse
 * ```
 * {{ amount | vnCurrency }}
 * ```
 *
 * @description
 *
 * This is a wrapper on top of angular default [CurrencyPipe](https://angular.io/api/common/CurrencyPipe). It
 * uses the users currency if none is specified and the display is configured in [dynacon](https://admin.dynacon.prod.env.works/services/105573/features/105697/keys/109562/valuematrix?_matchAncestors=true).
 *
 * It is possible to optionally override the `currencyCode` and `digitInfo` (`vnCurrency:code:digitInfo`). For details
 * about these parameters, consult the angular documentation.
 *
 * @stable
 */
@Pipe({
    standalone: true,
    name: 'vnCurrency',
})
export class CurrencyPipe implements PipeTransform {
    constructor(private intlService: IntlService) {}

    transform(amount: number | null | undefined, currencyCode?: string, digitInfo?: string): any {
        if (amount == null) {
            return '';
        }

        return this.intlService.formatCurrency(amount, currencyCode, digitInfo);
    }
}
