using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public class UnaryOperatorsTests
{
    private static IUnaryOperator GetTarget(Keyword keyword)
        => UnaryOperators.Operators.Single(o => o.Keyword == keyword);

    public static readonly IEnumerable<object[]> DslTypesTestCases = new[]
    {
        new object[] { Keyword.Not, DslType.Boolean, DslType.Boolean },
        new object[] { Keyword.LowerCase, DslType.String, DslType.String },
        new object[] { Keyword.UpperCase, DslType.String, DslType.String },
        new object[] { Keyword.Number, DslType.String, DslType.Number },
        new object[] { Keyword.String, DslType.Number, DslType.String },
        new object[] { Keyword.Trim, DslType.String, DslType.String },
        new object[] { Keyword.Round, DslType.Number, DslType.Number },
        new object[] { Keyword.Floor, DslType.Number, DslType.Number },
        new object[] { Keyword.Ceil, DslType.Number, DslType.Number },
        new object[] { Keyword.Length, DslType.String, DslType.Number },
        new object[] { Keyword.UrlEncode, DslType.String, DslType.String },
        new object[] { Keyword.UrlDecode, DslType.String, DslType.String },
    };

    [Theory, MemberData(nameof(DslTypesTestCases))]
    internal void DslTypes_ShouldBeExposedCorrectly(Keyword operatorToken, DslType expectedSupportedOperandType, DslType expectedResultType)
    {
        var target = GetTarget(operatorToken);

        // Act
        target.SupportedOperandType.Should().Be(expectedSupportedOperandType);
        target.ResultType.Should().Be(expectedResultType);
    }

    [Fact]
    public void DslTypes_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(DslTypesTestCases);

    public static readonly IEnumerable<object[]> EvaluateTestCases = new[]
    {
        new object[] { Keyword.Not, BooleanLiteral.True, BooleanLiteral.False },
        new object[] { Keyword.Not, BooleanLiteral.False, BooleanLiteral.True },
        new object[] { Keyword.LowerCase, StringLiteral.Get("Hello BWIN"), StringLiteral.Get("hello bwin") },
        new object[] { Keyword.UpperCase, StringLiteral.Get("Hello bwin"), StringLiteral.Get("HELLO BWIN") },
        new object[] { Keyword.Number, StringLiteral.Get("123"), NumberLiteral.Get(123m) },
        new object[] { Keyword.Number, StringLiteral.Get("1.23"), NumberLiteral.Get(1.23m) },
        new object[] { Keyword.String, NumberLiteral.Get(123m), StringLiteral.Get("123") },
        new object[] { Keyword.String, NumberLiteral.Get(1.23m), StringLiteral.Get("1.23") },
        new object[] { Keyword.Trim, StringLiteral.Get("  ab \t "), StringLiteral.Get("ab") },
        new object[] { Keyword.Round, NumberLiteral.Get(1m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Round, NumberLiteral.Get(1.23m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Round, NumberLiteral.Get(1.5m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Round, NumberLiteral.Get(1.79m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Floor, NumberLiteral.Get(1m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Floor, NumberLiteral.Get(1.23m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Floor, NumberLiteral.Get(1.5m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Floor, NumberLiteral.Get(1.79m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Ceil, NumberLiteral.Get(1.23m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Ceil, NumberLiteral.Get(1m), NumberLiteral.Get(1m) },
        new object[] { Keyword.Ceil, NumberLiteral.Get(1.5m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Ceil, NumberLiteral.Get(1.79m), NumberLiteral.Get(2m) },
        new object[] { Keyword.Length, StringLiteral.Empty, NumberLiteral.Get(0m) },
        new object[] { Keyword.Length, StringLiteral.Get("bwin"), NumberLiteral.Get(4m) },
        new object[] { Keyword.UrlEncode, StringLiteral.Get("a a b "), StringLiteral.Get("a%20a%20b%20") },
        new object[] { Keyword.UrlDecode, StringLiteral.Get("a%20a%20b%20"), StringLiteral.Get("a a b ") },
    };

    [Theory, MemberData(nameof(EvaluateTestCases))]
    internal void Evaluate_ShouldEvaluateCorrectly(Keyword operatorToken, Literal input, Literal expected)
    {
        var target = GetTarget(operatorToken);

        // Act
        var result = target.Evaluate(input);

        result.Should().Be(expected);
    }

    [Fact]
    public void Evaluate_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(EvaluateTestCases);

    [Fact]
    public void Evaluate_ShouldThrow_IfInvalidNumber()
    {
        var target = GetTarget(Keyword.Number);
        var literal = StringLiteral.Get("abc");

        Action act = () => target.Evaluate(literal);

        act.Should().Throw()
            .Which.Message.Should().Contain("'abc'");
    }

    public static readonly IEnumerable<object[]> SerializeToClientTestCases = new[]
    {
        new object[] { Keyword.Not, "!(op)" },
        new object[] { Keyword.LowerCase, "op.toLowerCase()" },
        new object[] { Keyword.UpperCase, "op.toUpperCase()" },
        new object[] { Keyword.Number, "parseFloat(op)" },
        new object[] { Keyword.String, "op.toString()" },
        new object[] { Keyword.Trim, "op.trim()" },
        new object[] { Keyword.Round, "Math.round(op)" },
        new object[] { Keyword.Ceil, "Math.ceil(op)" },
        new object[] { Keyword.Floor, "Math.floor(op)" },
        new object[] { Keyword.Length, "op.length" },
        new object[] { Keyword.UrlEncode, "encodeURI(op)" },
        new object[] { Keyword.UrlDecode, "decodeURI(op)" },
    };

    [Theory, MemberData(nameof(SerializeToClientTestCases))]
    internal void SerializeToClient_ShouldReturnClientExpression(Keyword operatorToken, string expected)
    {
        var target = GetTarget(operatorToken);

        // Act
        var result = target.SerializeToClient("op");

        result.Should().Be(expected);
    }

    [Fact]
    public void SerializeToClient_ShouldTestAllOperators()
        => VerifyAllOperatorsTested(SerializeToClientTestCases);

    public static IEnumerable<object[]> UnaryOperatorsTestCases => UnaryOperators.Operators.Select(o => new[] { o });

    [Theory, MemberData(nameof(UnaryOperatorsTestCases))]
    internal void ToString_ShouldGetTokenDescription(IUnaryOperator target)
        => target.ToString().Should().Be(target.Keyword.Name);

    private void VerifyAllOperatorsTested(IEnumerable<object[]> testCases)
        => testCases.Select(tc => tc[0]).Distinct().Should().BeEquivalentTo(
            UnaryOperators.Operators.Select(o => o.Keyword));
}
