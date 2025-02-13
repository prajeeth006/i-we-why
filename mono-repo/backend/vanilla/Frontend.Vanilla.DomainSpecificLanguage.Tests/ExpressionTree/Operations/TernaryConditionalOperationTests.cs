using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Operations;

public class TernaryConditionalOperationTests
{
    private Mock<IExpressionTree> condition;
    private Mock<IExpressionTree> consequent;
    private Mock<IExpressionTree> alternative;
    private EvaluationContext ctx;

    public TernaryConditionalOperationTests()
    {
        condition = new Mock<IExpressionTree>();
        consequent = new Mock<IExpressionTree>();
        alternative = new Mock<IExpressionTree>();
        ctx = TestEvaluationContext.Get();

        condition.SetupGet(c => c.ResultType).Returns(DslType.Boolean);
    }

    private TernaryConditionalOperation GetTarget()
        => new TernaryConditionalOperation(condition.Object, consequent.Object, alternative?.Object);

    [Theory]
    [InlineData(DslType.Number)]
    [InlineData(DslType.String)]
    internal void Constructor_ShouldCreateCorrectly(DslType operandType)
    {
        consequent.SetupGet(s => s.ResultType).Returns(operandType);
        alternative.SetupGet(s => s.ResultType).Returns(operandType);

        // Act
        var target = GetTarget();

        target.Condition.Should().BeSameAs(condition.Object);
        target.Consequent.Should().BeSameAs(consequent.Object);
        target.Alternative.Should().BeSameAs(alternative.Object);
        target.ResultType.Should().Be(operandType);
    }

    [Theory]
    // Invalid condition
    [InlineData(DslType.String, DslType.String, DslType.String)]
    [InlineData(DslType.Number, DslType.String, DslType.String)]
    [InlineData(DslType.Void, DslType.String, DslType.String)]

    // Not same operands
    [InlineData(DslType.Boolean, DslType.String, DslType.Number)]
    [InlineData(DslType.Boolean, DslType.Number, DslType.String)]

    // Invalid operands
    [InlineData(DslType.Boolean, DslType.Boolean, DslType.Boolean)]
    [InlineData(DslType.Boolean, DslType.Void, DslType.Void)]
    internal void Constructor_ShoudThrow_IfInvalidTypes(DslType conditionType, DslType consequentType, DslType alternativeType)
    {
        condition.SetupGet(c => c.ResultType).Returns(conditionType);
        consequent.SetupGet(s => s.ResultType).Returns(consequentType);
        alternative.SetupGet(s => s.ResultType).Returns(alternativeType);

        Func<object> act = GetTarget;

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnConsequentBody_IfConditionMatched()
    {
        var consequentEval = MockExpression();
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(BooleanLiteral.True);
        consequent.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(consequentEval);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(consequentEval);
        alternative.VerifyWithAnyArgs(s => s.EvaluateAsync(null), Times.Never);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnAlternative_IfConditionNotMatched()
    {
        var alternativeEval = MockExpression();
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(BooleanLiteral.False);
        alternative.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(alternativeEval);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(alternativeEval);
        consequent.VerifyWithAnyArgs(s => s.EvaluateAsync(null), Times.Never);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecreate_IfConditionNotFinal()
    {
        var conditionEval = MockExpression(DslType.Boolean);
        var consequentEval = MockExpression();
        var alternativeEval = MockExpression();
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(conditionEval);
        consequent.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(consequentEval);
        alternative.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(alternativeEval);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<TernaryConditionalOperation>(s =>
            s.Condition == conditionEval
            && s.Consequent == consequentEval
            && s.Alternative == alternativeEval);
    }

    [Fact]
    public void SerializeToClient_ShouldFormatCorrectly()
    {
        condition.Setup(s => s.SerializeToClient()).Returns("Foo.IsPassed");
        consequent.Setup(s => s.SerializeToClient()).Returns("Bar.Cons");
        alternative.Setup(s => s.SerializeToClient()).Returns("Bar.Alt");

        // Act
        var script = GetTarget().SerializeToClient();

        script.Should().Be("(Foo.IsPassed?Bar.Cons:Bar.Alt)");
    }

    [Fact]
    public void GetChildren_ShouldReturnAllBlocks()
        => GetTarget().GetChildren().Should().BeEquivalentTo(new[] { condition.Object, consequent.Object, alternative.Object });

    [Fact]
    public void ToString_ShouldFormatCorrectly()
    {
        condition.Setup(s => s.ToString()).Returns("Foo.IsPassed");
        consequent.Setup(s => s.ToString()).Returns("Bar.Cons");
        alternative.Setup(s => s.ToString()).Returns("Bar.Alt");

        // Act
        var str = GetTarget().ToString();

        str.Should().Be("(Foo.IsPassed ? Bar.Cons : Bar.Alt)");
    }

    public static IEnumerable<object[]> GetEqualityInlineDatas()
    {
        var (condition, equalCondition) = TestExpressionTree.GetEqual(DslType.Boolean);
        var (consequent, equalConsequent) = TestExpressionTree.GetEqual();
        var (alternative, equalAlternative) = TestExpressionTree.GetEqual();
        var target = new TernaryConditionalOperation(condition, consequent, alternative);

        return new[]
        {
            new object[] { true, target, new TernaryConditionalOperation(equalCondition, equalConsequent, equalAlternative) },
            new object[] { false, target, new TernaryConditionalOperation(MockExpression(DslType.Boolean), equalConsequent, equalAlternative) },
            new object[] { false, target, new TernaryConditionalOperation(equalCondition, MockExpression(), equalAlternative) },
            new object[] { false, target, new TernaryConditionalOperation(equalCondition, equalConsequent, MockExpression()) },
            new object[] { false, target, new TernaryConditionalOperation(equalCondition, equalAlternative, equalConsequent) },
            new object[] { false, target, new TernaryConditionalOperation(MockExpression(DslType.Boolean), MockExpression(), MockExpression()) },
        };
    }

    [Theory, MemberData(nameof(GetEqualityInlineDatas))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, TernaryConditionalOperation arg1, TernaryConditionalOperation arg2)
        => EqualityTest.Run(expected, arg1, arg2);

    private static IExpressionTree MockExpression(DslType resultType = DslType.String)
        => Mock.Of<IExpressionTree>(e => e.ResultType == resultType);
}
