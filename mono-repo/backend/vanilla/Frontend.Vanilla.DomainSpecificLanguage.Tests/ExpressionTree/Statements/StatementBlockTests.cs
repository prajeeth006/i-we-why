using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Statements;

public class StatementBlockTests
{
    private Mock<IExpressionTree> statement1;
    private Mock<IExpressionTree> statement2;
    private Mock<IExpressionTree> statement3;
    private EvaluationContext ctx;

    public StatementBlockTests()
    {
        statement1 = new Mock<IExpressionTree>();
        statement2 = new Mock<IExpressionTree>();
        statement3 = new Mock<IExpressionTree>();
        ctx = TestEvaluationContext.Get();

        statement1.SetupGet(s => s.ResultType).Returns(DslType.Void);
        statement2.SetupGet(s => s.ResultType).Returns(DslType.Void);
        statement3.SetupGet(s => s.ResultType).Returns(DslType.Void);
    }

    private StatementBlock GetTarget()
        => new StatementBlock(new[] { statement1.Object, statement2.Object, statement3.Object });

    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        // Act
        var target = GetTarget();

        target.Statements.Should().Equal(statement1.Object, statement2.Object, statement3.Object);
        target.ResultType.Should().Be(DslType.Void);
    }

    [Fact]
    public void Constructor_ShouldThrow_IfNotVoidStatements()
    {
        statement2.SetupGet(s => s.ResultType).Returns(DslType.String);

        Func<object> act = GetTarget;

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnVoid_IfAllEvaluated()
    {
        var order = new List<int>();
        SetupStatement(statement1, 1);
        SetupStatement(statement2, 2);
        SetupStatement(statement3, 3);

        void SetupStatement(Mock<IExpressionTree> statement, int index)
            => statement.Setup(s => s.EvaluateAsync(ctx))
                .Callback(() => order.Add(index))
                .ReturnsAsync(VoidLiteral.Singleton);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Be(VoidLiteral.Singleton);
        order.Should().Equal(1, 2, 3);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReturnStatement_IfSingleRemainingStatement()
    {
        var statement2Eval = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        statement1.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(VoidLiteral.Singleton);
        statement2.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(statement2Eval);
        statement3.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(VoidLiteral.Singleton);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(statement2Eval);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecreate_IfMultipleRemainingStatements()
    {
        var statement1Eval = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        var statement3Eval = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void);
        statement1.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(statement1Eval);
        statement2.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(VoidLiteral.Singleton);
        statement3.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(statement3Eval);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<StatementBlock>(b => b.Statements.SequenceEqual(statement1Eval, statement3Eval));
    }

    [Fact]
    public void SerializeToClient_ShouldConcatStatements()
    {
        statement1.Setup(s => s.SerializeToClient()).Returns("cmd1();");
        statement2.Setup(s => s.SerializeToClient()).Returns("cmd2();");
        statement3.Setup(s => s.SerializeToClient()).Returns("cmd3();");

        // Act
        var script = GetTarget().SerializeToClient();

        script.Should().Be("cmd1();cmd2();cmd3();");
    }

    [Fact]
    public void GetChildren_ShouldReturnStatemens()
        => GetTarget().GetChildren().Should().BeEquivalentTo(new[] { statement1.Object, statement2.Object, statement3.Object });

    [Fact]
    public void ToString_ShouldJoinStatements()
    {
        statement1.Setup(s => s.ToString()).Returns("cmd1();");
        statement2.Setup(s => s.ToString()).Returns("cmd2();");
        statement3.Setup(s => s.ToString()).Returns("cmd3();");

        // Act
        var str = GetTarget().ToString();

        str.Should().Be($"cmd1();{Environment.NewLine}cmd2();{Environment.NewLine}cmd3();");
    }

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var (statement1, equalStatement1) = TestExpressionTree.GetEqual(DslType.Void);
        var (statement2, equalStatement2) = TestExpressionTree.GetEqual(DslType.Void);
        var target = new StatementBlock(new[] { statement1, statement2 });

        return new[]
        {
            new object[] { true, target, new StatementBlock(new[] { equalStatement1, equalStatement2 }) },
            new object[] { false, target, new StatementBlock(new[] { equalStatement2, equalStatement1 }) }, // Different order
            new object[] { false, target, new StatementBlock(new[] { equalStatement1, Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void) }) },
            new object[] { false, target, new StatementBlock(new[] { Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void) }) },
        };
    }

    [Theory, MemberData(nameof(GetEqualityTestCases))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, StatementBlock arg1, StatementBlock arg2)
        => EqualityTest.Run(expected, arg1, arg2);
}
