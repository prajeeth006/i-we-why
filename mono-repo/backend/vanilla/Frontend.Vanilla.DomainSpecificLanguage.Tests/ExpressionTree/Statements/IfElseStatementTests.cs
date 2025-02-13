using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Operations;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.Statements;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.Statements;

public class IfElseStatementTests
{
    private Mock<IExpressionTree> condition;
    private Mock<IExpressionTree> thenStatement;
    private Mock<IExpressionTree> elseStatement;
    private EvaluationContext ctx;

    public IfElseStatementTests()
    {
        condition = new Mock<IExpressionTree>();
        thenStatement = new Mock<IExpressionTree>();
        elseStatement = new Mock<IExpressionTree>();
        ctx = TestEvaluationContext.Get();

        condition.SetupGet(c => c.ResultType).Returns(DslType.Boolean);
        thenStatement.SetupGet(s => s.ResultType).Returns(DslType.Void);
        elseStatement.SetupGet(s => s.ResultType).Returns(DslType.Void);
        thenStatement.Setup(s => s.GetLocalVariableUsages()).ReturnsEmpty();
        elseStatement.Setup(s => s.GetLocalVariableUsages()).ReturnsEmpty();
    }

    private IfElseStatement GetTarget()
        => new IfElseStatement(condition.Object, thenStatement.Object, elseStatement?.Object);

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Constructor_ShouldCreateCorrectly(bool hasElse)
    {
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var target = GetTarget();

        target.Condition.Should().BeSameAs(condition.Object);
        target.ThenStatement.Should().BeSameAs(thenStatement.Object);
        target.ElseStatement.Should().BeSameAs(elseStatement?.Object);
        target.ResultType.Should().Be(DslType.Void);
    }

    [Theory]
    [InlineData(DslType.String, DslType.Void, DslType.Void)]
    [InlineData(DslType.Void, DslType.Void, DslType.Void)]
    [InlineData(DslType.Boolean, DslType.Boolean, DslType.Void)]
    [InlineData(DslType.Boolean, DslType.Void, DslType.String)]
    internal void Constructor_ShoudThrow_IfInvalidTypes(DslType conditionType, DslType ifType, DslType elseType)
    {
        condition.SetupGet(c => c.ResultType).Returns(conditionType);
        thenStatement.SetupGet(s => s.ResultType).Returns(ifType);
        elseStatement.SetupGet(s => s.ResultType).Returns(elseType);

        Func<object> act = () => GetTarget();

        act.Should().Throw<ArgumentException>();
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task EvaluateAsync_ShouldExecuteThenStatement_IfConditionMatched(bool hasElse)
    {
        var thenEval = MockExpression();
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(BooleanLiteral.True);
        thenStatement.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(thenEval);
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(thenEval);
        elseStatement?.VerifyWithAnyArgs(s => s.EvaluateAsync(null), Times.Never);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task EvaluateAsync_ShouldNotExecuteThenStatement_IfConditionNotMatched(bool hasElse)
    {
        var elseEval = hasElse ? MockExpression() : null;
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(BooleanLiteral.False);
        elseStatement.Setup(s => s.EvaluateAsync(ctx)).ReturnsAsync(elseEval);
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(elseEval ?? VoidLiteral.Singleton);
        thenStatement.VerifyWithAnyArgs(s => s.EvaluateAsync(null), Times.Never);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task EvaluateAsync_ShouldRecreate_IfConditionNotFinal(bool hasElse)
    {
        var conditionEval = MockExpression(DslType.Boolean);
        var thenEval = MockExpression();
        var elseEval = hasElse ? MockExpression() : null;
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(conditionEval);
        thenStatement.Setup(s => s.EvaluateAsync(IsClonedContext(ctx))).ReturnsAsync(thenEval);
        elseStatement.Setup(s => s.EvaluateAsync(IsClonedContext(ctx))).ReturnsAsync(elseEval);

        ctx.LocalVariables["touchedThen"] = StringLiteral.Get("a");
        ctx.LocalVariables["touchedElse"] = StringLiteral.Get("b");
        ctx.LocalVariables["touchedBoth"] = StringLiteral.Get("c");
        ctx.LocalVariables["onlyAccessed"] = StringLiteral.Get("d");
        thenStatement.Setup(s => s.GetLocalVariableUsages()).Returns(new Dictionary<TrimmedRequiredString, LocalVariableInfo> // Doesn't matter if variables are accessed
        {
            { "touchedThen", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: true) },
            { "touchedBoth", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: false) },
            { "onlyAccessed", new LocalVariableInfo(DslType.String, isAssigned: false, isAccessed: true) },
        });
        elseStatement.Setup(s => s.GetLocalVariableUsages()).Returns(new Dictionary<TrimmedRequiredString, LocalVariableInfo>
        {
            { "touchedElse", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: false) },
            { "touchedBoth", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: true) },
        });
        elseStatement = hasElse ? elseStatement : null;

        var expectedVars = ctx.LocalVariables.ToDictionary();
        expectedVars["touchedThen"] = null;
        expectedVars["touchedElse"] = hasElse ? null : expectedVars["touchedElse"];
        expectedVars["touchedBoth"] = null;

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().Match<IfElseStatement>(s =>
            s.Condition == conditionEval
            && s.ThenStatement == thenEval
            && s.ElseStatement == elseEval);
        ctx.LocalVariables.Should().BeEquivalentTo(expectedVars);
    }

    public static IEnumerable<object[]> JsonTestCondition()
    {
        yield return new object[]
        {
            false,
            $"IF Foo.IsPassed THEN{Environment.NewLine}"
            + $"    Bar.Then1();{Environment.NewLine}"
            + $"    Bar.Then2();{Environment.NewLine}"
            + "END",
        };
        yield return new object[]
        {
            true,
            $"IF Foo.IsPassed THEN{Environment.NewLine}"
            + $"    Bar.Then1();{Environment.NewLine}"
            + $"    Bar.Then2();{Environment.NewLine}"
            + $"ELSE{Environment.NewLine}"
            + $"    Bar.Else1();{Environment.NewLine}"
            + $"    Bar.Else2();{Environment.NewLine}"
            + "END",
        };
        // Add more test cases here
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public async Task EvaluateAsync_ShouldReturnVoid_IfStatementsEvalutedToVoid(bool hasElse)
    {
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(MockExpression());
        thenStatement.Setup(s => s.EvaluateAsync(IsClonedContext(ctx))).ReturnsAsync(VoidLiteral.Singleton);
        elseStatement.Setup(s => s.EvaluateAsync(IsClonedContext(ctx))).ReturnsAsync(VoidLiteral.Singleton);
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(VoidLiteral.Singleton);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecreateInverted_IfConditionNotFinal_AndVoidThenStatement()
    {
        var conditionEval = MockExpression(DslType.Boolean);
        var elseEval = MockExpression();
        condition.Setup(c => c.EvaluateAsync(ctx)).ReturnsAsync(conditionEval);
        thenStatement.Setup(s => s.EvaluateAsync(IsClonedContext(ctx))).ReturnsAsync(VoidLiteral.Singleton);
        elseStatement.Setup(s => s.EvaluateAsync(IsClonedContext(ctx))).ReturnsAsync(elseEval);

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        var ifElse = (IfElseStatement)result;
        ifElse.Condition.Should().Match<UnaryOperation>(o => o.Operator.Keyword == Keyword.Not && o.Operand == conditionEval);
        ifElse.ThenStatement.Should().BeSameAs(elseEval);
        ifElse.ElseStatement.Should().BeNull();
    }

    private static EvaluationContext IsClonedContext(EvaluationContext other)
        => It.Is<EvaluationContext>(c =>
            !ReferenceEquals(c, other)
            && c.Mode.Equals(other.Mode)
            && c.Evaluation == other.Evaluation
            && c.LocalVariables.SequenceEqual(other.LocalVariables, null));

    [Theory]
    [InlineData(false, "if(Foo.IsPassed){Bar.Then();}")]
    [InlineData(true, "if(Foo.IsPassed){Bar.Then();}else{Bar.Else();}")]
    public void SerializeToClient_ShouldFormatCorrectly(bool hasElse, string expected)
    {
        condition.Setup(s => s.SerializeToClient()).Returns("Foo.IsPassed");
        thenStatement.Setup(s => s.SerializeToClient()).Returns("Bar.Then();");
        elseStatement.Setup(s => s.SerializeToClient()).Returns("Bar.Else();");
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var script = GetTarget().SerializeToClient();

        script.Should().Be(expected);
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void GetChildren_ShouldReturnAllExpressions(bool hasElse)
    {
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var children = GetTarget().GetChildren();

        children.Should().BeEquivalentTo(hasElse
            ? new[] { condition.Object, thenStatement.Object, elseStatement.Object }
            : new[] { condition.Object, thenStatement.Object });
    }

    [Theory]
    [MemberData(nameof(JsonTestCondition))]
    public void ToString_ShouldFormatCorrectly(bool hasElse, string expected)
    {
        condition.Setup(s => s.ToString()).Returns("Foo.IsPassed");
        thenStatement.Setup(s => s.ToString()).Returns($"Bar.Then1();{Environment.NewLine}Bar.Then2();");
        elseStatement.Setup(s => s.ToString()).Returns($"Bar.Else1();{Environment.NewLine}Bar.Else2();");
        elseStatement = hasElse ? elseStatement : null;

        // Act
        var str = GetTarget().ToString();

        str.Should().Be(expected);
    }

    [Fact]
    public void ToString_ShouldConsiderNextElseIf()
    {
        var firstCondition = Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Boolean && e.ToString() == "Foo.IsFirstPassed");
        var firstThenStatement =
            Mock.Of<IExpressionTree>(e => e.ResultType == DslType.Void && e.ToString() == $"Bar.FirstThen1();{Environment.NewLine}Bar.FirstThen2();");

        condition.Setup(s => s.ToString()).Returns("Foo.IsNextPassed");
        thenStatement.Setup(s => s.ToString()).Returns($"Bar.NextThen1();{Environment.NewLine}Bar.NextThen2();");
        elseStatement.Setup(s => s.ToString()).Returns($"Bar.Else1();{Environment.NewLine}Bar.Else2();");

        var target = new IfElseStatement(firstCondition, firstThenStatement, GetTarget());

        // Act
        var str = target.ToString();

        str.Should().Be($"IF Foo.IsFirstPassed THEN{Environment.NewLine}"
                        + $"    Bar.FirstThen1();{Environment.NewLine}"
                        + $"    Bar.FirstThen2();{Environment.NewLine}"
                        + $"ELSE-IF Foo.IsNextPassed THEN{Environment.NewLine}"
                        + $"    Bar.NextThen1();{Environment.NewLine}"
                        + $"    Bar.NextThen2();{Environment.NewLine}"
                        + $"ELSE{Environment.NewLine}"
                        + $"    Bar.Else1();{Environment.NewLine}"
                        + $"    Bar.Else2();{Environment.NewLine}"
                        + $"END");
    }

    public static IEnumerable<object[]> GetEqualityInlineDatas()
    {
        var (condition, equalCondition) = TestExpressionTree.GetEqual(DslType.Boolean);
        var (then, equalThen) = TestExpressionTree.GetEqual(DslType.Void);
        var (@else, equalElse) = TestExpressionTree.GetEqual(DslType.Void);
        var target = new IfElseStatement(condition, then, @else);

        return new[]
        {
            new object[] { true, target, new IfElseStatement(equalCondition, equalThen, equalElse) },
            new object[] { true, new IfElseStatement(condition, then, null), new IfElseStatement(equalCondition, equalThen, null) },
            new object[] { false, target, new IfElseStatement(MockExpression(DslType.Boolean), equalThen, equalElse) },
            new object[] { false, target, new IfElseStatement(equalCondition, MockExpression(), equalElse) },
            new object[] { false, target, new IfElseStatement(equalCondition, equalThen, MockExpression()) },
            new object[] { false, target, new IfElseStatement(equalCondition, equalThen, null) },
            new object[] { false, target, new IfElseStatement(equalCondition, equalElse, equalThen) },
            new object[] { false, target, new IfElseStatement(MockExpression(DslType.Boolean), MockExpression(), MockExpression()) },
        };
    }

    [Theory, MemberData(nameof(GetEqualityInlineDatas))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, IfElseStatement arg1, IfElseStatement arg2)
        => EqualityTest.Run(expected, arg1, arg2);

    [Fact]
    public void Equals_ShouldNotEqualToOtherValues()
        => EqualityTest.RunWithOtherValues(GetTarget());

    private static IExpressionTree MockExpression(DslType resultType = DslType.Void)
        => Mock.Of<IExpressionTree>(e => e.ResultType == resultType);
}
