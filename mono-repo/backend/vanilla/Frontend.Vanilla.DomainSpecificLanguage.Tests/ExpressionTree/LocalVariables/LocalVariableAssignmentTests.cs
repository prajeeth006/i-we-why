using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.LocalVariables;

public class LocalVariableAssignmentTests
{
    private readonly Mock<IExpressionTree> valueToSet = new ();

    private LocalVariableAssignment GetTarget()
        => new ("foo", valueToSet.Object);

    public static IEnumerable<object[]> DslTypesCases => DslTypeHelper.ResultTypes.Select(r => new object[] { r });

    [Theory, MemberData(nameof(DslTypesCases))]
    internal void Constructor_ShouldCreateCorrectly(DslType type)
    {
        valueToSet.SetupGet(v => v.ResultType).Returns(type);

        // Act
        var target = GetTarget();

        target.VariableName.Should().Be("foo");
        target.ValueToSet.Should().BeSameAs(valueToSet.Object);
        target.ResultType.Should().Be(DslType.Void);
    }

    [Fact]
    public void Constructor_ShouldThrow_IfVoidType()
    {
        valueToSet.SetupGet(v => v.ResultType).Returns(DslType.Void);

        Func<object> act = GetTarget;

        act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be("valueToSet");
    }

    [Theory]
    [InlineData(DslEvaluation.Optimization, true)]
    [InlineData(DslEvaluation.Optimization, false)]
    [InlineData(DslEvaluation.PartialForClient, true)]
    [InlineData(DslEvaluation.PartialForClient, false)]
    internal async Task EvaluateAsync_ShouldRecreate_IfNotFinalOrNotFullServerEvaluation(DslEvaluation evaluation, bool isFinal)
    {
        var literal = StringLiteral.Get("bwin");
        var evalResult = isFinal ? literal : Mock.Of<IExpressionTree>();
        await RunEvalTest(
            evaluation,
            evalResult,
            expectedVarAssignedTo: isFinal ? literal : null,
            verifyResult: r => r.Should().Match<LocalVariableAssignment>(a => a.VariableName == "foo" && a.ValueToSet == evalResult));
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnVoid_IfFullServerEvaluation()
    {
        var literal = StringLiteral.Get("bwin");
        await RunEvalTest(
            DslEvaluation.FullOnServer,
            evalResult: literal,
            expectedVarAssignedTo: literal,
            verifyResult: r => r.Should().BeSameAs(VoidLiteral.Singleton));
    }

    private async Task RunEvalTest(DslEvaluation evaluation, IExpressionTree evalResult, Literal expectedVarAssignedTo, Action<IExpressionTree> verifyResult)
    {
        var ctx = TestEvaluationContext.Get(evaluation);
        var previousVars = ctx.LocalVariables.ToDictionary();
        ctx.LocalVariables["foo"] = StringLiteral.Get("previous");
        valueToSet.Setup(v => v.EvaluateAsync(ctx)).ReturnsAsync(evalResult);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        previousVars["foo"] = expectedVarAssignedTo;
        ctx.LocalVariables.Should().BeEquivalentTo(previousVars);
        verifyResult(result);
    }

    [Fact]
    public void EvaluateAsync_ShouldThrow_IfServerEvaluationAndNotFinalResult()
    {
        var target = GetTarget();
        var ctx = TestEvaluationContext.Get(DslEvaluation.FullOnServer);
        ctx.LocalVariables["foo"] = StringLiteral.Get("previous");
        valueToSet.Setup(v => v.EvaluateAsync(ctx)).ReturnsAsync(Mock.Of<IExpressionTree>());

        Func<Task> act = () => target.EvaluateAsync(ctx);

        act.Should().ThrowAsync<InvalidOperationException>();
    }

    [Fact]
    public void EvaluateAsync_ShouldRemoveItself_IfVariableNotDeclared()
    {
        var ctx = TestEvaluationContext.Get();

        // Act
        var task = GetTarget().EvaluateAsync(ctx);

        task.Should().BeSameAs(VoidLiteral.SingletonTask);
        valueToSet.VerifyWithAnyArgs(v => v.EvaluateAsync(null), Times.Never);
    }

    [Fact]
    public void SerializeToClient_ShouldReturnClientAssignment()
    {
        valueToSet.Setup(v => v.SerializeToClient()).Returns("c.Value.Get()");

        // Act
        GetTarget().SerializeToClient().Should().Be("foo=c.Value.Get();");
    }

    [Fact]
    public void GetChildren_ShouldReturnEmpty()
        => GetTarget().GetChildren().Should().BeEquivalentTo(new[] { valueToSet.Object });

    [Fact]
    public void ToString_ShouldReturnOriginalAssignment()
    {
        valueToSet.Setup(v => v.ToString()).Returns("Value.Get()");

        // Act
        GetTarget().ToString().Should().Be("foo := Value.Get()");
    }

    public static IEnumerable<object[]> GetEqualityInlineDatas()
    {
        var (expr, equalExpr) = TestExpressionTree.GetEqual();
        var target = new LocalVariableAssignment("foo", expr);

        return new[]
        {
            new object[] { true, target, new LocalVariableAssignment("foo", equalExpr) },
            [false, target, new LocalVariableAssignment("bar", equalExpr)],
            [false, target, new LocalVariableAssignment("foo", Mock.Of<IExpressionTree>())],
        };
    }

    [Theory, MemberData(nameof(GetEqualityInlineDatas))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, LocalVariableAssignment arg1, LocalVariableAssignment arg2)
        => EqualityTest.Run(expected, arg1, arg2);
}
