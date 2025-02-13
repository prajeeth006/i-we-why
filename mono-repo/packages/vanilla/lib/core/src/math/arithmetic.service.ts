import { Injectable } from '@angular/core';

import { Lexer } from './lexer';
import { AstNode, EvaluationContext, Parser } from './parser';

/**
 * @whatItDoes Provides a way to evaluate simple arithmetic formula.
 *
 * @howToUse
 * ```
 * this.arithmeticService.solve('1 + 1') // = 2
 * this.arithmeticService.solve('a + 3', { a: 5 }) // = 8
 * this.arithmeticService.solve('(a + b) * 3', { a: 2, b: 4 }) // = 18
 * ```
 *
 * Takes a formula as a string and optional variables object. Then it parses it and evaluates it
 * using specified variables.
 *
 * Supported operators: + - * / ( )
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ArithmeticService {
    private astCache = new Map<string, AstNode>();

    solve(formula: string, variables: any = {}): any {
        if (!formula) {
            return null;
        }

        return this.getAst(formula).eval(new EvaluationContext(variables)).value;
    }

    private getAst(formula: string) {
        const cached = this.astCache.get(formula);
        if (cached) {
            return cached;
        } else {
            const tokenizer = new Lexer(formula);
            const parser = new Parser(tokenizer.tokenize());
            const ast = parser.parse();
            this.astCache.set(formula, ast);

            return ast;
        }
    }
}
