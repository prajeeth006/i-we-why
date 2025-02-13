using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Moq;
using Xunit;
using HashCode = Frontend.Vanilla.Core.System.HashCode;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public sealed class BinaryOperationTests
{
    private Mock<IBinaryOperator> @operator;
    private Mock<IExpressionTree> left;
    private Mock<IExpressionTree> right;
    private Mock<IEqualityComparer<BinaryOperation>> comparer;

    public BinaryOperationTests()
    {
        @operator = new Mock<IBinaryOperator>();
        left = new Mock<IExpressionTree>();
        right = new Mock<IExpressionTree>();
        comparer = new Mock<IEqualityComparer<BinaryOperation>>();

        @operator.SetupGet(o => o.Comparer).Returns(comparer.Object);
    }

    private BinaryOperation GetTarget() => new BinaryOperation(@operator.Object, left.Object, right.Object);

    [Fact]
    public void Constructor_ShouldCreateCorrectly()
        => GetTarget();

    [Theory]
    [InlineData(DslType.Boolean, DslType.Boolean)]
    [InlineData(DslType.Boolean, DslType.Number)]
    [InlineData(DslType.String, DslType.Void)]
    internal void Constructor_ShouldCreateCorrectlyWith(DslType leftType, DslType rightType)
    {
        left.SetupGet(e => e.ResultType).Returns(leftType);
        right.SetupGet(e => e.ResultType).Returns(rightType);
        @operator.SetupGet(o => o.LeftOperandType).Returns(leftType);
        @operator.SetupGet(o => o.RightOperandType).Returns(rightType);

        // Act
        var target = GetTarget();

        target.Operator.Should().BeSameAs(@operator.Object);
        target.LeftOperand.Should().BeSameAs(left.Object);
        target.RightOperand.Should().BeSameAs(right.Object);
    }

    [Theory]
    [InlineData(DslType.Number, default(DslType), nameof(BinaryOperation.LeftOperand))]
    [InlineData(default(DslType), DslType.Boolean, nameof(BinaryOperation.RightOperand))]
    internal void Constructor_ShouldThrow_IfOperandTypesNotMatchingOperator(DslType leftType, DslType rightType, string expectedParam)
    {
        left.SetupGet(e => e.ResultType).Returns(leftType);
        right.SetupGet(e => e.ResultType).Returns(rightType);

        Func<object> act = GetTarget;

        act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().BeEquivalentTo(expectedParam);
    }

    [Theory]
    [InlineData(DslType.Boolean)]
    [InlineData(DslType.Void)]
    internal void ResultType_ShouldDelegateToOperator(DslType type)
    {
        @operator.SetupGet(o => o.ResultType).Returns(type);

        // Act
        GetTarget().ResultType.Should().Be(type);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldDelegateToOperatorEvaluator()
    {
        var target = GetTarget();
        var evaluated = Mock.Of<IExpressionTree>();
        var ctx = TestEvaluationContext.Get();
        @operator.Setup(o => o.Evaluator.EvaluateAsync(target, ctx)).ReturnsAsync(evaluated);

        // Act
        var result = await target.EvaluateAsync(ctx);

        result.Should().BeSameAs(evaluated);
    }

    [Fact]
    public void SerializeToClient_ShouldDelegateToOperator()
    {
        left.Setup(e => e.SerializeToClient()).Returns("x");
        right.Setup(e => e.SerializeToClient()).Returns("y");
        @operator.Setup(o => o.SerializeToClient("x", "y")).Returns("xyz");

        // Act
        var script = GetTarget().SerializeToClient();

        script.Should().Be("(xyz)");
    }

    [Fact]
    public void GetChildren_ShouldReturnOperands()
        => GetTarget().GetChildren().Should().BeEquivalentTo(new[] { left.Object, right.Object });

    [Theory]
    [InlineData(true, true, true)]
    [InlineData(false, true, false)]
    [InlineData(true, false, false)]
    [InlineData(false, false, false)]
    public void Equals_ShouldReturnTrue_IfSameOperatorAndOperands(bool sameOperator, bool equalOperands, bool expected)
    {
        var target = GetTarget();
        var otherOperator = sameOperator ? target.Operator : Mock.Of<IBinaryOperator>();
        var other = new BinaryOperation(otherOperator, Mock.Of<IExpressionTree>(), Mock.Of<IExpressionTree>());
        comparer.Setup(c => c.Equals(target, other)).Returns(equalOperands);

        target.Equals(other).Should().Be(expected); // Act
    }

    [Fact]
    public void GetHashCode_ShouldDelegateToOperatorComparer()
    {
        var target = GetTarget();
        @operator.Setup(o => o.GetHashCode()).Returns(111);
        comparer.Setup(c => c.GetHashCode(target)).Returns(222);

        var result = target.GetHashCode(); // Act

        result.Should().Be(HashCode.Combine(111, 222));
    }

    [Fact]
    public void ToString_ShouldRecreateOriginalExpression()
    {
        @operator.SetupGet(o => o.Keyword).Returns(Keyword.Matches);
        left.Setup(o => o.ToString()).Returns("ll");
        right.Setup(o => o.ToString()).Returns("rr");

        GetTarget().ToString().Should().Be("(ll MATCHES rr)");
    }
}
