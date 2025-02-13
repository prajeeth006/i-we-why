import { Token, TokenType } from './lexer';

export abstract class AstNode {
    abstract eval(context: EvaluationContext): EvaluationResult;
}

export class EvaluationContext {
    constructor(public variables: { [variable: string]: any }) {}
}

export class EvaluationResult {
    constructor(
        public value: any,
        public errors: string[] = [],
    ) {}
}

class LiteralNode extends AstNode {
    private value: number;

    constructor(value: any) {
        super();
        this.value = parseFloat(value);
    }

    eval() {
        return new EvaluationResult(this.value);
    }
}

class VariableNode extends AstNode {
    constructor(private name: string) {
        super();
    }

    eval(context: EvaluationContext) {
        if (!context.variables.hasOwnProperty(this.name)) {
            return new EvaluationResult(undefined, [`Reference to undeclared variable '${this.name}'.`]);
        }

        return new EvaluationResult(context.variables[this.name]);
    }
}

class OperatorNode extends AstNode {
    constructor(
        private operation: string,
        private left: AstNode,
        private right: AstNode,
    ) {
        super();
    }

    eval(context: EvaluationContext) {
        const left = this.left.eval(context);
        const right = this.right.eval(context);

        if (this.operation === '?') {
            return new EvaluationResult(left.value === undefined ? this.check(right).value : left.value);
        }

        this.check(left);
        this.check(right);

        let value: any;

        switch (this.operation) {
            case '+':
                value = left.value + right.value;
                break;
            case '-':
                value = left.value - right.value;
                break;
            case '*':
                value = left.value * right.value;
                break;
            case '/':
                value = left.value / right.value;
                break;
            default:
                throw new Error();
        }

        return new EvaluationResult(value);
    }

    private check(result: EvaluationResult) {
        if (result.errors.length) {
            throw new Error(result.errors.join(', '));
        }

        return result;
    }
}

class AstNodeFactory {
    create(token: Token, left?: AstNode, right?: AstNode): AstNode {
        switch (token.type) {
            case TokenType.Literal:
                return new LiteralNode(token.value);
            case TokenType.Variable:
                return new VariableNode(token.value);
            case TokenType.Operator:
                if (!left || !right) {
                    throw new Error();
                }

                return new OperatorNode(token.value, left, right);
            default:
                throw new Error();
        }
    }
}

export class Parser {
    constructor(private tokens: Token[]) {}

    parse() {
        this.convertNegativeNumbers();
        this.postfix();

        return this.ast();
    }

    private ast() {
        const nodes: { node: AstNode; token: Token }[] = [];
        const factory = new AstNodeFactory();

        for (const token of this.tokens) {
            if (token.type === TokenType.Operator) {
                if (nodes.length < 2) {
                    throw new Error(`Not enough operands for operator '${token.value}' at position ${token.position}.`);
                }

                const right = nodes.pop()!.node;
                const left = nodes.pop()!.node;

                nodes.push({ node: factory.create(token, left, right), token });
            } else {
                nodes.push({ node: factory.create(token), token });
            }
        }

        if (nodes.length !== 1) {
            const token = nodes[0]!.token;

            switch (token.type) {
                case TokenType.Variable:
                    throw new Error(`Unexpected variable '${token.value}' at position ${token.position}.`);
                case TokenType.Literal:
                    throw new Error(`Unexpected value '${token.value}' at position ${token.position}.`);
            }
        }

        return nodes[0]!.node;
    }

    private convertNegativeNumbers() {
        const result: Token[] = [];

        let token1: Token | null = null;
        let token2: Token | null = null;
        for (const token3 of this.tokens) {
            if (
                token1 &&
                token2 &&
                token2.type === TokenType.Operator &&
                token2.value === '-' &&
                token1.type !== TokenType.Literal &&
                token1.type !== TokenType.Variable
            ) {
                result.pop();
                result.push(new Token(token3.type, `-${token3.value}`, token2.position));
            } else {
                result.push(token3);
            }

            token1 = token2;
            token2 = token3;
        }

        this.tokens = result;
    }

    private postfix() {
        const operatorStack: Token[] = [];
        const output: Token[] = [];

        for (const token of this.tokens) {
            switch (token.type) {
                case TokenType.Literal:
                case TokenType.Variable:
                    output.push(token);
                    break;
                case TokenType.Operator:
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const operator = operatorStack[operatorStack.length - 1];

                        if (!operator || operator.type !== TokenType.Operator || operator.precedence < token.precedence) {
                            break;
                        }

                        output.push(operatorStack.pop()!);
                    }

                    operatorStack.push(token);
                    break;
                case TokenType.Parenthesis:
                    if (token.value === '(') {
                        operatorStack.push(token);
                    } else {
                        // eslint-disable-next-line no-constant-condition
                        while (true) {
                            const operator = operatorStack.pop();
                            if (!operator) {
                                throw new Error(`Unmatched ')' at position ${token.position}.`);
                            }

                            if (operator.type === TokenType.Parenthesis && operator.value === '(') {
                                break;
                            } else {
                                output.push(operator);
                            }
                        }
                    }
                    break;
            }
        }

        while (operatorStack.length) {
            const operator = operatorStack.pop()!;
            if (operator.type === TokenType.Parenthesis) {
                throw new Error(`Unmatched '(' at position ${operator.position}.`);
            }

            output.push(operator);
        }

        this.tokens = output;
    }
}
