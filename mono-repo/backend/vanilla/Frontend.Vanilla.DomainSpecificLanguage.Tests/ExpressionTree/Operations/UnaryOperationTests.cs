using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public sealed class UnaryOperationTests
{
    private UnaryOperation target;
    private Mock<IUnaryOperator> @operator;
    private Mock<IExpressionTree> operand;
    private EvaluationContext ctx;

    public UnaryOperationTests()
    {
        @operator = new Mock<IUnaryOperator>();
        operand = new Mock<IExpressionTree>();
        target = new UnaryOperation(@operator.Object, operand.Object);
        ctx = TestEvaluationContext.Get();
    }

    [Theory]
    [InlineData(DslType.Boolean)]
    [InlineData(DslType.Number)]
    [InlineData(DslType.String)]
    [InlineData(DslType.Void)]
    internal void Constructor_ShouldCreateCorrectly(DslType operandType)
    {
        @operator.SetupGet(o => o.SupportedOperandType).Returns(operandType);
        operand.SetupGet(e => e.ResultType).Returns(operandType);

        // Act
        target = new UnaryOperation(@operator.Object, operand.Object);

        target.Operator.Should().Be(@operator.Object);
        target.Operand.Should().BeSameAs(operand.Object);
    }

    [Theory]
    [InlineData(true, "nothing")]
    [InlineData(false, "a String operand")]
    public void Constructor_ShouldThrow_IfOperandTypeUnsupportedForOperator(bool nullOperand, string reportedOperand)
    {
        @operator.SetupGet(o => o.SupportedOperandType).Returns(DslType.Number);
        @operator.Setup(o => o.ToString()).Returns("Magic");
        if (nullOperand) operand = null;

        Func<object> act = () => new UnaryOperation(@operator.Object, operand?.Object); // Act

        act.Should().Throw<DslArgumentException>().WithMessage(
            $"Magic requires Number expression as its operand but there is {reportedOperand}.");
    }

    [Theory]
    [InlineData(DslType.Boolean)]
    [InlineData(DslType.Number)]
    [InlineData(DslType.String)]
    [InlineData(DslType.Void)]
    internal void ResultType_ShouldDelegateToOperator(DslType value)
    {
        @operator.SetupGet(o => o.ResultType).Returns(value);

        target.ResultType.Should().Be(value); // Act
    }

    [Fact]
    public async Task EvaluateAsync_ShouldFullyEvaluate()
    {
        var lolLiteral = StringLiteral.Get("lol");
        var wtfLiteral = StringLiteral.Get("wtf");
        operand.Setup(o => o.EvaluateAsync(ctx)).ReturnsAsync(lolLiteral);
        @operator.Setup(o => o.Evaluate(lolLiteral)).Returns(wtfLiteral);

        // Act
        var result = await target.EvaluateAsync(ctx);

        result.Should().BeSameAs(wtfLiteral);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecreateOperation_IfOperandNotEvaluatedToLiteral()
    {
        var evaluated = Mock.Of<IExpressionTree>();
        operand.Setup(o => o.EvaluateAsync(ctx)).ReturnsAsync(evaluated);

        // Act
        var result = await target.EvaluateAsync(ctx);

        result.Should().Match<UnaryOperation>(o => o.Operator == target.Operator && o.Operand == evaluated);
        @operator.VerifyWithAnyArgs(o => o.Evaluate(null), Times.Never);
    }

    [Fact]
    public void SerializeToClient_ShouldReturnClientExpression()
    {
        operand.Setup(o => o.SerializeToClient()).Returns("ooo");
        @operator.Setup(o => o.SerializeToClient("ooo")).Returns("aaa");

        // Act
        var result = target.SerializeToClient();

        result.Should().Be("aaa");
    }

    [Fact]
    public void GetChildren_ShouldReturnOperand()
        => target.GetChildren().Should().BeEquivalentTo(new[] { operand.Object });

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var (operand, equalOperand) = TestExpressionTree.GetEqual();
        var @operator = Mock.Of<IUnaryOperator>(o => o.Keyword == Keyword.Addition);
        var otherOperator = Mock.Of<IUnaryOperator>(o => o.Keyword == Keyword.Addition);
        var target = new UnaryOperation(@operator, operand);

        return new[]
        {
            new object[] { true, target, new UnaryOperation(@operator, equalOperand) },
            new object[] { false, target, new UnaryOperation(otherOperator, equalOperand) }, // Different operator
            new object[] { false, target, new UnaryOperation(@operator, Mock.Of<IExpressionTree>()) }, // Different operand
            new object[] { false, target, new UnaryOperation(otherOperator, Mock.Of<IExpressionTree>()) }, // Completely different
        };
    }

    [Theory, MemberData(nameof(GetEqualityTestCases))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, UnaryOperation arg1, UnaryOperation arg2)
        => EqualityTest.Run(expected, arg1, arg2);

    [Fact]
    public void ToString_ShouldReturnOperatorAndOperand()
    {
        @operator.SetupGet(o => o.Keyword).Returns(Keyword.Number);
        operand.Setup(o => o.ToString()).Returns("abc");

        target.ToString().Should().Be("(NUMBER abc)");
    }
}
