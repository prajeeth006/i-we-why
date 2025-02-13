import { Pipe, PipeTransform } from '@angular/core';

import { ArithmeticService } from './arithmetic.service';

/**
 * @whatItDoes Parses and evaluates a formula with optional variables, and returns the result.
 *
 * See also: {@link ArithmeticService}.
 *
 * @stable
 */
@Pipe({
    standalone: true,
    name: 'vnSolve',
})
export class SolvePipe implements PipeTransform {
    constructor(private arithmeticService: ArithmeticService) {}

    transform(formula: string, variables: any): any {
        return this.arithmeticService.solve(formula, variables);
    }
}
