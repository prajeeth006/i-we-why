using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public sealed class BinaryOperatorsTests
{
    [Fact]
    public void Operators_ShouldNotContainDuplicates()
        => BinaryOperators.Operators
            .GroupBy(o => (o.Keyword, o.LeftOperandType, o.RightOperandType))
            .Where(g => g.Count() > 1)
            .Should().BeEmpty();

    public static readonly IEnumerable<object[]> TypesTestCases = new[]
    {
        new object[] { Keyword.And, DslType.Boolean, DslType.Boolean, DslType.Boolean },
        new object[] { Keyword.Or, DslType.Boolean, DslType.Boolean, DslType.Boolean },
        new object[] { Keyword.Or, DslType.String, DslType.String, DslType.String },
        new object[] { Keyword.Or, DslType.Number, DslType.Number, DslType.Number },
        new object[] { Keyword.Equality, DslType.Boolean, DslType.Boolean, DslType.Boolean },
        new object[] { Keyword.Equality, DslType.String, DslType.String, DslType.Boolean },
        new object[] { Keyword.Equality, DslType.Number, DslType.Number, DslType.Boolean },
        new object[] { Keyword.Inequality, DslType.Boolean, DslType.Boolean, DslType.Boolean },
        new object[] { Keyword.Inequality, DslType.String, DslType.String, DslType.Boolean },
        new object[] { Keyword.Inequality, DslType.Number, DslType.Number, DslType.Boolean },
        new object[] { Keyword.Matches, DslType.String, DslType.String, DslType.Boolean },
        new object[] { Keyword.Contains, DslType.String, DslType.String, DslType.Boolean },
        new object[] { Keyword.StartsWith, DslType.String, DslType.String, DslType.Boolean },
        new object[] { Keyword.EndsWith, DslType.String, DslType.String, DslType.Boolean },
        new object[] { Keyword.Less, DslType.Number, DslType.Number, DslType.Boolean },
        new object[] { Keyword.LessOrEqual, DslType.Number, DslType.Number, DslType.Boolean },
        new object[] { Keyword.Greater, DslType.Number, DslType.Number, DslType.Boolean },
        new object[] { Keyword.GreaterOrEqual, DslType.Number, DslType.Number, DslType.Boolean },
        new object[] { Keyword.Addition, DslType.Number, DslType.Number, DslType.Number },
        new object[] { Keyword.Addition, DslType.String, DslType.String, DslType.String },
        new object[] { Keyword.Subtraction, DslType.Number, DslType.Number, DslType.Number },
        new object[] { Keyword.Multiplication, DslType.Number, DslType.Number, DslType.Number },
        new object[] { Keyword.Division, DslType.Number, DslType.Number, DslType.Number },
        new object[] { Keyword.Modulo, DslType.Number, DslType.Number, DslType.Number },
        new object[] { Keyword.IndexOf, DslType.String, DslType.String, DslType.Number },
        new object[] { Keyword.LastIndexOf, DslType.String, DslType.String, DslType.Number },
        new object[] { Keyword.SubstringFrom, DslType.String, DslType.Number, DslType.String },
        new object[] { Keyword.Take, DslType.String, DslType.Number, DslType.String },
    };

    [Theory, MemberData(nameof(TypesTestCases))]
    internal void Types_ShouldBeCorrect(Keyword keyword, DslType leftType, DslType rightType, DslType resultType)
        => BinaryOperators.Operators.Should().ContainSingle(o =>
                o.Keyword == keyword
                && o.LeftOperandType == leftType
                && o.RightOperandType == rightType)
            .Which.ResultType.Should().Be(resultType);

    [Fact]
    public void SupportedOperandToResultTypes_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(TypesTestCases);

    public static readonly IEnumerable<object[]> EvaluteBinaryTestCases = new[]
    {
        new object[] { Keyword.Equality, BooleanLiteral.True, BooleanLiteral.True, BooleanLiteral.True },
        new object[] { Keyword.Equality, BooleanLiteral.False, BooleanLiteral.False, BooleanLiteral.True },
        new object[] { Keyword.Equality, BooleanLiteral.True, BooleanLiteral.False, BooleanLiteral.False },
        new object[] { Keyword.Equality, BooleanLiteral.False, BooleanLiteral.True, BooleanLiteral.False },
        new object[] { Keyword.Equality, StringLiteral.Get("a"), StringLiteral.Get("a"), BooleanLiteral.True },
        new object[] { Keyword.Equality, StringLiteral.Get("a"), StringLiteral.Get("b"), BooleanLiteral.False },
        new object[] { Keyword.Equality, NumberLiteral.Get(666m), NumberLiteral.Get(666m), BooleanLiteral.True },
        new object[] { Keyword.Equality, NumberLiteral.Get(6.66m), NumberLiteral.Get(6.66m), BooleanLiteral.True },
        new object[] { Keyword.Equality, NumberLiteral.Get(666m), NumberLiteral.Get(777m), BooleanLiteral.False },
        new object[] { Keyword.Equality, NumberLiteral.Get(6.66m), NumberLiteral.Get(7.77m), BooleanLiteral.False },
        new object[] { Keyword.Inequality, BooleanLiteral.True, BooleanLiteral.True, BooleanLiteral.False },
        new object[] { Keyword.Inequality, BooleanLiteral.False, BooleanLiteral.False, BooleanLiteral.False },
        new object[] { Keyword.Inequality, BooleanLiteral.True, BooleanLiteral.False, BooleanLiteral.True },
        new object[] { Keyword.Inequality, BooleanLiteral.False, BooleanLiteral.True, BooleanLiteral.True },
        new object[] { Keyword.Inequality, StringLiteral.Get("a"), StringLiteral.Get("a"), BooleanLiteral.False },
        new object[] { Keyword.Inequality, StringLiteral.Get("a"), StringLiteral.Get("b"), BooleanLiteral.True },
        new object[] { Keyword.Inequality, NumberLiteral.Get(666m), NumberLiteral.Get(666m), BooleanLiteral.False },
        new object[] { Keyword.Inequality, NumberLiteral.Get(6.66m), NumberLiteral.Get(6.66m), BooleanLiteral.False },
        new object[] { Keyword.Inequality, NumberLiteral.Get(666m), NumberLiteral.Get(777m), BooleanLiteral.True },
        new object[] { Keyword.Inequality, NumberLiteral.Get(6.66m), NumberLiteral.Get(7.77m), BooleanLiteral.True },
        new object[] { Keyword.Less, NumberLiteral.Get(6m), NumberLiteral.Get(9m), BooleanLiteral.True },
        new object[] { Keyword.Less, NumberLiteral.Get(6.6m), NumberLiteral.Get(9.9m), BooleanLiteral.True },
        new object[] { Keyword.Less, NumberLiteral.Get(6m), NumberLiteral.Get(6m), BooleanLiteral.False },
        new object[] { Keyword.Less, NumberLiteral.Get(6.6m), NumberLiteral.Get(6.6m), BooleanLiteral.False },
        new object[] { Keyword.Less, NumberLiteral.Get(6m), NumberLiteral.Get(3m), BooleanLiteral.False },
        new object[] { Keyword.Less, NumberLiteral.Get(6.6m), NumberLiteral.Get(3.3m), BooleanLiteral.False },
        new object[] { Keyword.LessOrEqual, NumberLiteral.Get(6m), NumberLiteral.Get(9m), BooleanLiteral.True },
        new object[] { Keyword.LessOrEqual, NumberLiteral.Get(6.6m), NumberLiteral.Get(9.9m), BooleanLiteral.True },
        new object[] { Keyword.LessOrEqual, NumberLiteral.Get(6m), NumberLiteral.Get(6m), BooleanLiteral.True },
        new object[] { Keyword.LessOrEqual, NumberLiteral.Get(6.6m), NumberLiteral.Get(6.6m), BooleanLiteral.True },
        new object[] { Keyword.LessOrEqual, NumberLiteral.Get(6m), NumberLiteral.Get(3m), BooleanLiteral.False },
        new object[] { Keyword.LessOrEqual, NumberLiteral.Get(6.6m), NumberLiteral.Get(3.3m), BooleanLiteral.False },
        new object[] { Keyword.Greater, NumberLiteral.Get(6m), NumberLiteral.Get(9m), BooleanLiteral.False },
        new object[] { Keyword.Greater, NumberLiteral.Get(6.6m), NumberLiteral.Get(9.9m), BooleanLiteral.False },
        new object[] { Keyword.Greater, NumberLiteral.Get(6m), NumberLiteral.Get(6m), BooleanLiteral.False },
        new object[] { Keyword.Greater, NumberLiteral.Get(6.6m), NumberLiteral.Get(6.6m), BooleanLiteral.False },
        new object[] { Keyword.Greater, NumberLiteral.Get(6m), NumberLiteral.Get(3m), BooleanLiteral.True },
        new object[] { Keyword.Greater, NumberLiteral.Get(6.6m), NumberLiteral.Get(3.3m), BooleanLiteral.True },
        new object[] { Keyword.GreaterOrEqual, NumberLiteral.Get(6m), NumberLiteral.Get(9m), BooleanLiteral.False },
        new object[] { Keyword.GreaterOrEqual, NumberLiteral.Get(6.6m), NumberLiteral.Get(9.9m), BooleanLiteral.False },
        new object[] { Keyword.GreaterOrEqual, NumberLiteral.Get(6m), NumberLiteral.Get(6m), BooleanLiteral.True },
        new object[] { Keyword.GreaterOrEqual, NumberLiteral.Get(6.6m), NumberLiteral.Get(6.6m), BooleanLiteral.True },
        new object[] { Keyword.GreaterOrEqual, NumberLiteral.Get(6m), NumberLiteral.Get(3m), BooleanLiteral.True },
        new object[] { Keyword.GreaterOrEqual, NumberLiteral.Get(6.6m), NumberLiteral.Get(3.3m), BooleanLiteral.True },
        new object[] { Keyword.Matches, StringLiteral.Get("abcd"), StringLiteral.Get("b[^d]"), BooleanLiteral.True },
        new object[] { Keyword.Matches, StringLiteral.Get("abdc"), StringLiteral.Get("b[^d]"), BooleanLiteral.False },
        new object[] { Keyword.Contains, StringLiteral.Get("abcd"), StringLiteral.Get("bc"), BooleanLiteral.True },
        new object[] { Keyword.Contains, StringLiteral.Get("abdc"), StringLiteral.Get("bc"), BooleanLiteral.False },
        new object[] { Keyword.StartsWith, StringLiteral.Get("bcda"), StringLiteral.Get("bc"), BooleanLiteral.True },
        new object[] { Keyword.StartsWith, StringLiteral.Get("abdc"), StringLiteral.Get("bc"), BooleanLiteral.False },
        new object[] { Keyword.EndsWith, StringLiteral.Get("adbc"), StringLiteral.Get("bc"), BooleanLiteral.True },
        new object[] { Keyword.EndsWith, StringLiteral.Get("abcd"), StringLiteral.Get("bc"), BooleanLiteral.False },
        new object[] { Keyword.Addition, NumberLiteral.Get(1m), NumberLiteral.Get(2m), NumberLiteral.Get(3m) },
        new object[] { Keyword.Addition, NumberLiteral.Get(1.1m), NumberLiteral.Get(2.2m), NumberLiteral.Get(3.3m) },
        new object[] { Keyword.Addition, StringLiteral.Get("a"), StringLiteral.Get("b"), StringLiteral.Get("ab") },
        new object[] { Keyword.Subtraction, NumberLiteral.Get(3m), NumberLiteral.Get(1m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Subtraction, NumberLiteral.Get(3.3m), NumberLiteral.Get(1.1m), NumberLiteral.Get(2.2m) },
        new object[] { Keyword.Multiplication, NumberLiteral.Get(2m), NumberLiteral.Get(3m), NumberLiteral.Get(6m) },
        new object[] { Keyword.Multiplication, NumberLiteral.Get(2.2m), NumberLiteral.Get(3.3m), NumberLiteral.Get(7.26m) },
        new object[] { Keyword.Division, NumberLiteral.Get(7m), NumberLiteral.Get(2m), NumberLiteral.Get(3.5m) },
        new object[] { Keyword.Division, NumberLiteral.Get(7.7m), NumberLiteral.Get(2.2m), NumberLiteral.Get(3.5m) },
        new object[] { Keyword.Modulo, NumberLiteral.Get(8m), NumberLiteral.Get(3m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Modulo, NumberLiteral.Get(8.8m), NumberLiteral.Get(3.3m), NumberLiteral.Get(2.2m) },
        new object[] { Keyword.IndexOf, StringLiteral.Get("hihi haha"), StringLiteral.Get("ha"), NumberLiteral.Get(5) },
        new object[] { Keyword.IndexOf, StringLiteral.Get("hihi haha"), StringLiteral.Get("x"), NumberLiteral.Get(-1) },
        new object[] { Keyword.LastIndexOf, StringLiteral.Get("hihi haha"), StringLiteral.Get("ha"), NumberLiteral.Get(7) },
        new object[] { Keyword.LastIndexOf, StringLiteral.Get("hihi haha"), StringLiteral.Get("x"), NumberLiteral.Get(-1) },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(-66), StringLiteral.Get("James Bond") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(-10), StringLiteral.Get("James Bond") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(-4), StringLiteral.Get("Bond") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(0), StringLiteral.Get("James Bond") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(6), StringLiteral.Get("Bond") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(6.7m), StringLiteral.Get("Bond") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(10), StringLiteral.Get("") },
        new object[] { Keyword.SubstringFrom, StringLiteral.Get("James Bond"), NumberLiteral.Get(66), StringLiteral.Get("") },
        new object[] { Keyword.Take, StringLiteral.Get("James Bond"), NumberLiteral.Get(-1), StringLiteral.Get("") },
        new object[] { Keyword.Take, StringLiteral.Get("James Bond"), NumberLiteral.Get(0), StringLiteral.Get("") },
        new object[] { Keyword.Take, StringLiteral.Get("James Bond"), NumberLiteral.Get(5), StringLiteral.Get("James") },
        new object[] { Keyword.Take, StringLiteral.Get("James Bond"), NumberLiteral.Get(10), StringLiteral.Get("James Bond") },
        new object[] { Keyword.Take, StringLiteral.Get("James Bond"), NumberLiteral.Get(66), StringLiteral.Get("James Bond") },
    };

    [Theory, MemberData(nameof(EvaluteBinaryTestCases))]
    internal void Evaluator_ShouldEvaluateCorrectly_IfSimpleBinary(Keyword operatorKeyword, Literal left, Literal right, Literal expected)
    {
        var evaluator = (BinaryOperationEvaluator)GetTarget(operatorKeyword, left.ResultType).Evaluator;

        // Act
        var result = evaluator.Evaluate(left, right);

        result.Should().Be(expected);
    }

    public static readonly IEnumerable<object[]> EvaluteLogicalTestCases = new[]
    {
        new object[] { Keyword.And, BooleanLiteral.False, LogicalCompositionResult.ThisLiteral }, // false AND x => false
        new object[] { Keyword.And, BooleanLiteral.True, LogicalCompositionResult.OtherOperand }, // true AND x => x
        new object[] { Keyword.Or, BooleanLiteral.True, LogicalCompositionResult.ThisLiteral }, // true OR x => true
        new object[] { Keyword.Or, BooleanLiteral.False, LogicalCompositionResult.OtherOperand }, // false OR x => x
    };

    [Theory, MemberData(nameof(EvaluteLogicalTestCases))]
    internal void Evaluator_ShouldEvaluateCorrectly_IfLogicalComposition(Keyword keyword, BooleanLiteral literal, LogicalCompositionResult expected)
    {
        var target = GetTarget(keyword, literal.ResultType);
        var evaluator = (LogicalCompositionEvaluator)target.Evaluator;

        // Act
        evaluator.Evaluate(literal).Should().Be(expected);
    }

    public static readonly IEnumerable<object[]> EvaluteNotEmptyTestCases = new[]
    {
        new object[] { Keyword.Or, NumberLiteral.Get(-1), false },
        new object[] { Keyword.Or, NumberLiteral.Get(0), true },
        new object[] { Keyword.Or, NumberLiteral.Get(0.1m), false },
        new object[] { Keyword.Or, NumberLiteral.Get(1), false },
        new object[] { Keyword.Or, NumberLiteral.Get(66), false },
        new object[] { Keyword.Or, StringLiteral.Get(""), true },
        new object[] { Keyword.Or, StringLiteral.Get("a"), false },
        new object[] { Keyword.Or, StringLiteral.Get("  "), false },
    };

    [Theory, MemberData(nameof(EvaluteNotEmptyTestCases))]
    internal void Evaluator_ShouldEvaluateCorrectly_IfNotEmptyEvaluator<TLiteral>(Keyword keyword, TLiteral literal, bool expectedIsEmpty)
        where TLiteral : Literal
    {
        var target = GetTarget(keyword, literal.ResultType);
        var evaluator = (NotEmptyOperandEvaluator<TLiteral>)target.Evaluator;

        // Act
        evaluator.IsEmpty(literal).Should().Be(expectedIsEmpty);
    }

    [Fact]
    public void Evaluator_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(EvaluteBinaryTestCases
            .Concat(EvaluteLogicalTestCases)
            .Concat(EvaluteNotEmptyTestCases)
            .Select(tc => new object[] { tc[0], ((Literal)tc[1]).ResultType }));

    public static readonly IEnumerable<object[]> SerializeToClientTestCases = new[]
    {
        new object[] { Keyword.And, DslType.Boolean, "x&&y" },
        new object[] { Keyword.Or, DslType.Boolean, "x||y" },
        new object[] { Keyword.Or, DslType.String, "x||y" },
        new object[] { Keyword.Or, DslType.Number, "x||y" },
        new object[] { Keyword.Equality, DslType.Boolean, "x===y" },
        new object[] { Keyword.Equality, DslType.Number, "x===y" },
        new object[] { Keyword.Equality, DslType.String, "x===y" },
        new object[] { Keyword.Inequality, DslType.Boolean, "x!==y" },
        new object[] { Keyword.Inequality, DslType.Number, "x!==y" },
        new object[] { Keyword.Inequality, DslType.String, "x!==y" },
        new object[] { Keyword.Matches, DslType.String, "new RegExp(y).test(x)" },
        new object[] { Keyword.Contains, DslType.String, "x.includes(y)" },
        new object[] { Keyword.StartsWith, DslType.String, "x.startsWith(y)" },
        new object[] { Keyword.EndsWith, DslType.String, "x.endsWith(y)" },
        new object[] { Keyword.Less, DslType.Number, "x<y" },
        new object[] { Keyword.LessOrEqual, DslType.Number, "x<=y" },
        new object[] { Keyword.Greater, DslType.Number, "x>y" },
        new object[] { Keyword.GreaterOrEqual, DslType.Number, "x>=y" },
        new object[] { Keyword.Addition, DslType.String, "x+y" },
        new object[] { Keyword.Addition, DslType.Number, "x+y" },
        new object[] { Keyword.Subtraction, DslType.Number, "x-y" },
        new object[] { Keyword.Multiplication, DslType.Number, "x*y" },
        new object[] { Keyword.Division, DslType.Number, "x/y" },
        new object[] { Keyword.Modulo, DslType.Number, "x%y" },
        new object[] { Keyword.IndexOf, DslType.String, "x.indexOf(y)" },
        new object[] { Keyword.LastIndexOf, DslType.String, "x.lastIndexOf(y)" },
        new object[] { Keyword.SubstringFrom, DslType.String, "x.substr(y)" },
        new object[] { Keyword.Take, DslType.String, "x.substr(0,y)" },
    };

    [Theory, MemberData(nameof(SerializeToClientTestCases))]
    internal void SerializeToClient_ShouldReturnCorrectClientExpression(Keyword operatorKeyword, DslType leftType, string expected)
    {
        var target = GetTarget(operatorKeyword, leftType);

        // Act
        target.SerializeToClient("x", "y").Should().Be(expected);
    }

    [Fact]
    public void SerializeToClient_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(SerializeToClientTestCases);

    public static readonly IEnumerable<object[]> ComparerTestCases = new[]
    {
        new object[] { Keyword.And, DslType.Boolean, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Or, DslType.Boolean, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Or, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Or, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Equality, DslType.Boolean, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Equality, DslType.String, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Equality, DslType.Number, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Inequality, DslType.Boolean, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Inequality, DslType.String, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Inequality, DslType.Number, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Matches, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Contains, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.StartsWith, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.EndsWith, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Less, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.LessOrEqual, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Greater, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.GreaterOrEqual, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Addition, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Addition, DslType.Number, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Subtraction, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Multiplication, DslType.Number, BinaryOperationOperandComparers.InsignificantOperandOrder },
        new object[] { Keyword.Division, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Modulo, DslType.Number, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.IndexOf, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.LastIndexOf, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.SubstringFrom, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
        new object[] { Keyword.Take, DslType.String, BinaryOperationOperandComparers.SignificantOperandOrder },
    };

    [Theory, MemberData(nameof(ComparerTestCases))]
    internal void Comparer_ShouldGetCorrectComparer(Keyword operatorToken, DslType leftType, IEqualityComparer<BinaryOperation> expected)
    {
        var target = GetTarget(operatorToken, leftType);

        // Act
        target.Comparer.Should().BeSameAs(expected);
    }

    [Fact]
    public void Comparer_ShouldNotBeIsignificantOperandOrder_IfDifferentOperandTypes()
    {
        var invalid = BinaryOperators.Operators.Where(o =>
            o.Comparer == BinaryOperationOperandComparers.InsignificantOperandOrder
            && o.LeftOperandType != o.RightOperandType);

        invalid.Should().BeEmpty("Insigificant operands comparer can't be used if operands are of different type.");
    }

    [Fact]
    public void GetOperandComparer_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(ComparerTestCases);

    public static IEnumerable<object[]> OperatorCases => BinaryOperators.Operators.Select(o => new object[] { o });

    [Theory, MemberData(nameof(OperatorCases))]
    internal void ToString_ShouldGetTokenDescription(IBinaryOperator target)
        => target.ToString().Should().Be(target.Keyword.Name);

    private static IBinaryOperator GetTarget(Keyword keyword, DslType leftType)
        => BinaryOperators.Operators.Single(o => o.Keyword == keyword && o.LeftOperandType == leftType);

    private void VerifyAllOperatorsTested(IEnumerable<object[]> testCases)
        => testCases.Select(tc => ((Keyword)tc[0], (DslType)tc[1]))
            .Except(BinaryOperators.Operators.Select(o => (o.Keyword, o.LeftOperandType)))
            .Should().BeEmpty("particular operator should be tested");
}
