import { Lexer, Token, TokenType } from '../../src/math/lexer';

describe('Lexer', () => {
    test('simple', 'a + 2', [new Token(TokenType.Variable, 'a', 1), new Token(TokenType.Operator, '+', 3), new Token(TokenType.Literal, '2', 5)]);
    test('no whitespace', 'a+2', [
        new Token(TokenType.Variable, 'a', 1),
        new Token(TokenType.Operator, '+', 2),
        new Token(TokenType.Literal, '2', 3),
    ]);
    test('var', 'someVar', [new Token(TokenType.Variable, 'someVar', 1)]);
    test('literal', '225', [new Token(TokenType.Literal, '225', 1)]);
    test('plus', '+', [new Token(TokenType.Operator, '+', 1)]);
    test('minus', '-', [new Token(TokenType.Operator, '-', 1)]);
    test('multiply', '*', [new Token(TokenType.Operator, '*', 1)]);
    test('divide', '/', [new Token(TokenType.Operator, '/', 1)]);
    test('left paren', '(', [new Token(TokenType.Parenthesis, '(', 1)]);
    test('right paren', ')', [new Token(TokenType.Parenthesis, ')', 1)]);
    test('invalid char', 'bla&', `Invalid token '&' at position 4.`);

    function test(desc: string, formula: string, expected: Token[] | string) {
        it(desc, () => {
            const lexer = new Lexer(formula);

            if (typeof expected === 'string') {
                expect(() => lexer.tokenize()).toThrowError(expected);
            } else {
                const tokens = lexer.tokenize();

                expect(tokens.length).toBe(expected.length);

                for (let i = 0; i < tokens.length; i++) {
                    expect(tokens[i]!.type).toBe(expected[i]!.type);
                    expect(tokens[i]!.value).toBe(expected[i]!.value);
                    expect(tokens[i]!.position).toBe(expected[i]!.position);
                }
            }
        });
    }
});
