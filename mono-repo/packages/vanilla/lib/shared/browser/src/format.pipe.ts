import { Pipe, PipeTransform } from '@angular/core';

import { UtilsService } from '@frontend/vanilla/core';

/**
 * @whatItDoes Provides format pipe
 *
 * @howToUse `<div>{{'User: {0} Balance: {1}' | format:user.name : user.balance}}</div>`
 *
 * @stable
 */
@Pipe({ standalone: true, name: 'format', pure: true })
export class FormatPipe implements PipeTransform {
    constructor(private util: UtilsService) {}

    transform(mask: string | undefined, ...args: any[]): string {
        return this.util.format(mask!, ...args);
    }
}
