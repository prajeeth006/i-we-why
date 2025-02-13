using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;

namespace Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;

/// <summary>Operator which defines specifics of <see cref="BinaryOperation" />.</summary>
internal interface IBinaryOperator
{
    Keyword Keyword { get; }
    DslType LeftOperandType { get; }
    DslType RightOperandType { get; }
    DslType ResultType { get; }
    IBinaryOperationEvaluator Evaluator { get; }
    IEqualityComparer<BinaryOperation> Comparer { get; }

    string SerializeToClient(string leftOperand, string rightOperand);
}

/// <summary>List of binary operators known in Vanilla DSL.</summary>
internal static class BinaryOperators
{
    public static readonly IReadOnlyList<IBinaryOperator> Operators = new[]
    {
        new BinaryOperator<BooleanLiteral, BooleanLiteral, BooleanLiteral>(
            Keyword.And,
            evaluator: new LogicalCompositionEvaluator(operand => operand.Value
                ? LogicalCompositionResult.OtherOperand // If true and other -> other
                : LogicalCompositionResult.ThisLiteral), // If false and other -> false
            serializeToClient: (left, right) => $"{left}&&{right}",
            comparer: BinaryOperationOperandComparers.InsignificantOperandOrder),

        new BinaryOperator<BooleanLiteral, BooleanLiteral, BooleanLiteral>(
            Keyword.Or,
            evaluator: new LogicalCompositionEvaluator(operand => operand.Value
                ? LogicalCompositionResult.ThisLiteral // If true or other -> true
                : LogicalCompositionResult.OtherOperand), // If false or other -> other
            serializeToClient: (left, right) => $"{left}||{right}",
            comparer: BinaryOperationOperandComparers.InsignificantOperandOrder),

        new BinaryOperator<StringLiteral, StringLiteral, StringLiteral>(
            Keyword.Or,
            evaluator: new NotEmptyOperandEvaluator<StringLiteral>(o => o.Value.Length == 0),
            serializeToClient: (left, right) => $"{left}||{right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, NumberLiteral>(
            Keyword.Or,
            evaluator: new NotEmptyOperandEvaluator<NumberLiteral>(o => o.Value == 0),
            serializeToClient: (left, right) => $"{left}||{right}"),

        new BinaryOperator<StringLiteral, StringLiteral, BooleanLiteral>(
            Keyword.Matches,
            evaluate: (left, right) => Regex.IsMatch(left.Value, right.Value),
            serializeToClient: (left, right) => $"new RegExp({right}).test({left})"),

        new BinaryOperator<StringLiteral, StringLiteral, BooleanLiteral>(
            Keyword.Contains,
            evaluate: (left, right) => left.Value.Contains(right.Value),
            serializeToClient: (left, right) => $"{left}.includes({right})"),

        new BinaryOperator<StringLiteral, StringLiteral, BooleanLiteral>(
            Keyword.StartsWith,
            evaluate: (left, right) => left.Value.StartsWith(right.Value),
            serializeToClient: (left, right) => $"{left}.startsWith({right})"),

        new BinaryOperator<StringLiteral, StringLiteral, BooleanLiteral>(
            Keyword.EndsWith,
            evaluate: (left, right) => left.Value.EndsWith(right.Value),
            serializeToClient: (left, right) => $"{left}.endsWith({right})"),

        new BinaryOperator<NumberLiteral, NumberLiteral, BooleanLiteral>(
            Keyword.Less,
            evaluate: (left, right) => left.Value < right.Value,
            serializeToClient: (left, right) => $"{left}<{right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, BooleanLiteral>(
            Keyword.LessOrEqual,
            evaluate: (left, right) => left.Value <= right.Value,
            serializeToClient: (left, right) => $"{left}<={right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, BooleanLiteral>(
            Keyword.Greater,
            evaluate: (left, right) => left.Value > right.Value,
            serializeToClient: (left, right) => $"{left}>{right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, BooleanLiteral>(
            Keyword.GreaterOrEqual,
            evaluate: (left, right) => left.Value >= right.Value,
            serializeToClient: (left, right) => $"{left}>={right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, NumberLiteral>(
            Keyword.Addition,
            evaluate: (left, right) => NumberLiteral.Get(left.Value + right.Value),
            serializeToClient: (left, right) => $"{left}+{right}",
            comparer: BinaryOperationOperandComparers.InsignificantOperandOrder),

        new BinaryOperator<StringLiteral, StringLiteral, StringLiteral>(
            Keyword.Addition,
            evaluate: (left, right) => StringLiteral.Get(left.Value + right.Value),
            serializeToClient: (left, right) => $"{left}+{right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, NumberLiteral>(
            Keyword.Subtraction,
            evaluate: (left, right) => NumberLiteral.Get(left.Value - right.Value),
            serializeToClient: (left, right) => $"{left}-{right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, NumberLiteral>(
            Keyword.Multiplication,
            evaluate: (left, right) => NumberLiteral.Get(left.Value * right.Value),
            serializeToClient: (left, right) => $"{left}*{right}",
            comparer: BinaryOperationOperandComparers.InsignificantOperandOrder),

        new BinaryOperator<NumberLiteral, NumberLiteral, NumberLiteral>(
            Keyword.Division,
            evaluate: (left, right) => NumberLiteral.Get(left.Value / right.Value),
            serializeToClient: (left, right) => $"{left}/{right}"),

        new BinaryOperator<NumberLiteral, NumberLiteral, NumberLiteral>(
            Keyword.Modulo,
            evaluate: (left, right) => NumberLiteral.Get(left.Value % right.Value),
            serializeToClient: (left, right) => $"{left}%{right}"),

        new BinaryOperator<StringLiteral, StringLiteral, NumberLiteral>(
            Keyword.IndexOf,
            evaluate: (left, right) => NumberLiteral.Get(left.Value.IndexOf(right.Value)),
            serializeToClient: (left, right) => $"{left}.indexOf({right})"),

        new BinaryOperator<StringLiteral, StringLiteral, NumberLiteral>(
            Keyword.LastIndexOf,
            evaluate: (left, right) => NumberLiteral.Get(left.Value.LastIndexOf(right.Value)),
            serializeToClient: (left, right) => $"{left}.lastIndexOf({right})"),

        new BinaryOperator<StringLiteral, NumberLiteral, StringLiteral>(
            Keyword.SubstringFrom,
            evaluate: (left, right) => (int)right.Value switch // Same logic as JavaScript
            {
                var i when i >= left.Value.Length => StringLiteral.Empty,
                var i when i > 0 => StringLiteral.Get(left.Value.Substring(i)),
                var i when i < 0 && i > -1 * left.Value.Length => StringLiteral.Get(left.Value.Substring(left.Value.Length + i)), // Negative index -> count from end
                _ => left, // Zero or less than negative length -> entire string
            },
            serializeToClient: (left, right) => $"{left}.substr({right})"),

        new BinaryOperator<StringLiteral, NumberLiteral, StringLiteral>(
            Keyword.Take,
            evaluate: (left, right) => (int)right.Value switch // Same logic as JavaScript
            {
                var i when i >= left.Value.Length => left,
                var i when i > 0 => StringLiteral.Get(left.Value.Substring(0, i)),
                _ => StringLiteral.Empty,
            },
            serializeToClient: (left, right) => $"{left}.substr(0,{right})"),

        CreateEqualityOperator<BooleanLiteral>(true),
        CreateEqualityOperator<StringLiteral>(true),
        CreateEqualityOperator<NumberLiteral>(true),

        CreateEqualityOperator<BooleanLiteral>(false),
        CreateEqualityOperator<StringLiteral>(false),
        CreateEqualityOperator<NumberLiteral>(false),
    };

    private static IBinaryOperator CreateEqualityOperator<TLiteral>(bool equals)
        where TLiteral : Literal
        => new BinaryOperator<TLiteral, TLiteral, BooleanLiteral>(
            keyword: equals ? Keyword.Equality : Keyword.Inequality,
            evaluate: equals
                ? new Func<TLiteral, TLiteral, BooleanLiteral>((left, right) => left.Equals(right))
                : (left, right) => !left.Equals(right),
            serializeToClient: equals
                ? new Func<string, string, string>((left, right) => $"{left}==={right}")
                : (left, right) => $"{left}!=={right}",
            comparer: BinaryOperationOperandComparers.InsignificantOperandOrder);

    private sealed class BinaryOperator<TLeftOperand, TRightOperand, TResult>(
        Keyword keyword,
        IBinaryOperationEvaluator evaluator,
        Func<string, string, string> serializeToClient,
        IEqualityComparer<BinaryOperation>? comparer = null)
        : IBinaryOperator
        where TLeftOperand : Literal
        where TRightOperand : Literal
        where TResult : Literal
    {
        public DslType LeftOperandType { get; } = Literal.GetDslType<TLeftOperand>();
        public DslType RightOperandType { get; } = Literal.GetDslType<TRightOperand>();
        public DslType ResultType { get; } = Literal.GetDslType<TResult>();

        public Keyword Keyword { get; } = keyword;
        public IBinaryOperationEvaluator Evaluator { get; } = evaluator;
        public IEqualityComparer<BinaryOperation> Comparer { get; } = comparer ?? BinaryOperationOperandComparers.SignificantOperandOrder;
        public Func<string, string, string> SerializeToClientFunc { get; } = serializeToClient;

        public BinaryOperator(
            Keyword keyword,
            Func<TLeftOperand, TRightOperand, TResult> evaluate,
            Func<string, string, string> serializeToClient,
            IEqualityComparer<BinaryOperation>? comparer = null)
            : this(keyword, new BinaryOperationEvaluator((l, r) => evaluate((TLeftOperand)l, (TRightOperand)r)), serializeToClient, comparer) { }

        public string SerializeToClient(string leftOperand, string rightOperand)
            => SerializeToClientFunc(leftOperand, rightOperand);

        public override string ToString()
            => Keyword.Name;
    }
}
