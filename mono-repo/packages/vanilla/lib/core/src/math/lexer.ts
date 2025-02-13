export enum TokenType {
    Operator = 'Operator',
    Variable = 'Variable',
    Literal = 'Literal',
    Parenthesis = 'Parenthesis',
}

export class Token {
    constructor(
        public type: TokenType,
        public value: any,
        public position: number,
    ) {}

    get precedence(): number {
        if (this.value === '?') {
            return 20;
        }
        if (['*', '/'].indexOf(this.value) !== -1) {
            return 10;
        } else if (['+', '-'].indexOf(this.value) !== -1) {
            return 5;
        }

        return -1;
    }
}

function isDigit(c: string) {
    return c >= '0' && c <= '9';
}

function isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$';
}

function isAlphanumeric(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_' || c === '$';
}

export class Lexer {
    private static OperatorMap: { [key: string]: TokenType } = {
        '*': TokenType.Operator,
        '/': TokenType.Operator,
        '+': TokenType.Operator,
        '-': TokenType.Operator,
        '?': TokenType.Operator,
        '(': TokenType.Parenthesis,
        ')': TokenType.Parenthesis,
    };
    private pos: number = 0;
    private inputLength: number = 0;

    constructor(private input: string) {
        this.inputLength = this.input.length;
    }

    tokenize() {
        const tokens: Token[] = [];
        let token = this.token();
        while (token != null) {
            tokens.push(token);
            token = this.token();
        }

        return tokens;
    }

    private token(): Token | null {
        this.skipNonTokens();
        if (this.pos >= this.inputLength) {
            return null;
        }

        // The char at this.pos is part of a real token. Figure out which.
        const c = this.input.charAt(this.pos);

        const op = Lexer.OperatorMap[c];
        if (op) {
            return new Token(op, c, ++this.pos);
        } else {
            // Not an operator - so it's the beginning of another token.
            if (isAlpha(c)) {
                return this.processIdentifier();
            } else if (isDigit(c)) {
                return this.processNumber();
            } else {
                throw Error(`Invalid token '${c}' at position ${this.pos + 1}.`);
            }
        }
    }

    private processNumber() {
        return this.processToken(TokenType.Literal, isDigit);
    }

    private processIdentifier() {
        return this.processToken(TokenType.Variable, isAlphanumeric);
    }

    private processToken(type: TokenType, checkFn: (c: string) => boolean) {
        let end = this.pos + 1;
        while (end < this.inputLength && checkFn(this.input.charAt(end))) {
            end++;
        }

        const token = new Token(type, this.input.substring(this.pos, end), this.pos + 1);
        this.pos = end;
        return token;
    }

    private skipNonTokens() {
        while (this.pos < this.inputLength) {
            const c = this.input.charAt(this.pos);
            if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
                this.pos++;
            } else {
                break;
            }
        }
    }
}
