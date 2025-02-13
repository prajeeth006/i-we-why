using System;
using System.Collections.Generic;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>Operator which defines specifics of <see cref="UnaryOperation" />.</summary>
internal interface IUnaryOperator
{
    Keyword Keyword { get; }
    DslType SupportedOperandType { get; }
    DslType ResultType { get; }
    Literal Evaluate(Literal operand);
    string SerializeToClient(string operand);
}

/// <summary>List of unary operators known in Vanilla DSL.</summary>
internal static class UnaryOperators
{
    public static readonly IReadOnlyList<IUnaryOperator> Operators = new IUnaryOperator[]
    {
        new UnaryOperator<BooleanLiteral, BooleanLiteral>(
            Keyword.Not,
            evaluate: operand => !operand.Value,
            serializeToClient: operand => $"!({operand})"),

        new UnaryOperator<StringLiteral, StringLiteral>(
            Keyword.LowerCase,
            evaluate: operand => StringLiteral.Get(operand.Value.ToLower()),
            serializeToClient: operand => $"{operand}.toLowerCase()"),

        new UnaryOperator<StringLiteral, StringLiteral>(
            Keyword.UpperCase,
            evaluate: operand => StringLiteral.Get(operand.Value.ToUpper()),
            serializeToClient: operand => $"{operand}.toUpperCase()"),

        new UnaryOperator<StringLiteral, StringLiteral>(
            Keyword.Trim,
            evaluate: operand => StringLiteral.Get(operand.Value.Trim()),
            serializeToClient: operand => $"{operand}.trim()"),

        new UnaryOperator<StringLiteral, NumberLiteral>(
            Keyword.Number,
            evaluate: operand => DslNumber.TryParse(operand.Value, out var number)
                ? NumberLiteral.Get(number)
                : throw new Exception($"Failed to convert string '{operand.Value}' to a number as requested using {Keyword.Number}."),
            serializeToClient: operand => $"parseFloat({operand})"),

        new UnaryOperator<NumberLiteral, StringLiteral>(
            Keyword.String,
            evaluate: operand => StringLiteral.Get(DslNumber.ToString(operand.Value)),
            serializeToClient: operand => $"{operand}.toString()"),

        new UnaryOperator<NumberLiteral, NumberLiteral>(
            Keyword.Round,
            evaluate: operand => NumberLiteral.Get(Math.Round(operand.Value)),
            serializeToClient: operand => $"Math.round({operand})"),

        new UnaryOperator<NumberLiteral, NumberLiteral>(
            Keyword.Floor,
            evaluate: operand => NumberLiteral.Get(Math.Floor(operand.Value)),
            serializeToClient: operand => $"Math.floor({operand})"),

        new UnaryOperator<NumberLiteral, NumberLiteral>(
            Keyword.Ceil,
            evaluate: operand => NumberLiteral.Get(Math.Ceiling(operand.Value)),
            serializeToClient: operand => $"Math.ceil({operand})"),

        new UnaryOperator<StringLiteral, NumberLiteral>(
            Keyword.Length,
            evaluate: operand => NumberLiteral.Get(operand.Value.Length),
            serializeToClient: operand => $"{operand}.length"),

        new UnaryOperator<StringLiteral, StringLiteral>(
            Keyword.UrlEncode,
            evaluate: operand => StringLiteral.Get(Uri.EscapeDataString(operand.Value)),
            serializeToClient: operand => $"encodeURI({operand})"), // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

        new UnaryOperator<StringLiteral, StringLiteral>(
            Keyword.UrlDecode,
            evaluate: operand => StringLiteral.Get(Uri.UnescapeDataString(operand.Value)),
            serializeToClient: operand => $"decodeURI({operand})"), // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI
    };

    private sealed class UnaryOperator<TOperand, TResult>(Keyword keyword, Func<TOperand, TResult> evaluate, Func<string, string> serializeToClient)
        : IUnaryOperator
        where TOperand : Literal
        where TResult : Literal
    {
        public Keyword Keyword { get; } = keyword;

        public DslType SupportedOperandType { get; } = Literal.GetDslType<TOperand>();
        public DslType ResultType { get; } = Literal.GetDslType<TResult>();

        public Literal Evaluate(Literal operand)
            => evaluate((TOperand)operand);

        public string SerializeToClient(string operand)
            => serializeToClient(operand);

        public override string ToString()
            => Keyword.Name;
    }
}
