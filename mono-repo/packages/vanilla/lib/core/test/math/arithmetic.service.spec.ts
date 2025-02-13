import { ArithmeticService } from '@frontend/vanilla/core';

describe('ArithmeticService', () => {
    let service: ArithmeticService;

    beforeEach(() => {
        service = new ArithmeticService();
    });

    test('add', 'a + b', { a: 5, b: 2 }, 7);
    test('subtract', 'a - b', { a: 5, b: 2 }, 3);
    test('multiply', 'a * b', { a: 5, b: 2 }, 10);
    test('divide', 'a / b', { a: 5, b: 2 }, 2.5);
    test('literal', 'a + b + 5', { a: 5, b: 2 }, 12);
    test('negative', 'a - -1', { a: 5 }, 6);
    test('precedence', '2 + 2 * 3', {}, 8);
    test('parens', '(2 + 2) * 3', {}, 12);
    test('parens mismatch )', '(2 + 2 * 3', {}, `Unmatched '(' at position 1.`);
    test('parens mismatch (', '2 + 2) * 3', {}, `Unmatched ')' at position 6.`);
    test('missing variable', 'a - 1', { b: 5 }, `Reference to undeclared variable 'a'.`);
    test('coalesce missing variable', 'a ? 0 + 1', { b: 5 }, 1);
    test('syntax error op', '2 + + 2', {}, `Not enough operands for operator '+' at position 3.`);
    test('syntax error var', 'a b + 2', {}, `Unexpected variable 'a' at position 1.`);
    test('syntax error lit', '2 b + 2', {}, `Unexpected value '2' at position 1.`);

    function test(desc: string, formula: string, variables: { [variable: string]: any }, expected: string | number) {
        it(desc, () => {
            if (typeof expected === 'string') {
                expect(() => service.solve(formula, variables)).toThrowError(expected);
            } else {
                expect(service.solve(formula, variables)).toBe(expected);
            }
        });
    }
});
