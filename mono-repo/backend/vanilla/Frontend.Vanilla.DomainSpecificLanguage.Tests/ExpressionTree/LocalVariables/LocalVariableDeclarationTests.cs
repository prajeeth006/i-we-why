using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree.LocalVariables;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.ExpressionTree.LocalVariables;

public class LocalVariableDeclarationTests
{
    private Mock<IExpressionTree> inner;
    private Dictionary<TrimmedRequiredString, DslType> localVars;
    private EvaluationContext ctx;
    private Mock<IExpressionTree> innerResult;

    public LocalVariableDeclarationTests()
    {
        inner = new Mock<IExpressionTree>();
        localVars = new Dictionary<TrimmedRequiredString, DslType>();
        ctx = TestEvaluationContext.Get();
        innerResult = new Mock<IExpressionTree>();

        localVars["text"] = DslType.String;
        localVars["count"] = DslType.Number;
        localVars["isOk"] = DslType.Boolean;
        inner.Setup(i => i.EvaluateAsync(ctx)).ReturnsAsync(innerResult.Object);
    }

    private LocalVariableDeclaration GetTarget()
        => new LocalVariableDeclaration(inner.Object, localVars);

    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        // Act
        var target = GetTarget();

        target.ResultType.Should().Be(DslType.Void);
        target.Inner.Should().BeSameAs(inner.Object);
        target.LocalVariableDefaults.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, Literal>
        {
            { "text", StringLiteral.Empty },
            { "count", NumberLiteral.Zero },
            { "isOk", BooleanLiteral.False },
        });
    }

    [Fact]
    public void Constructor_ShouldThrow_IfVoidVariable()
    {
        localVars["wtf"] = DslType.Void;

        Func<object> act = GetTarget;

        act.Should().Throw<ArgumentException>()
            .Which.ParamName.Should().Be("localVariables");
    }

    [Fact]
    public async Task EvaluateAsync_ShouldDeclareAllVariables()
    {
        Dictionary<TrimmedRequiredString, Literal> receivedVars = null;
        inner.Setup(i => i.EvaluateAsync(ctx))
            .Callback<EvaluationContext>(c => receivedVars = c.LocalVariables.ToDictionary())
            .ReturnsAsync(innerResult.Object);
        innerResult.Setup(r => r.GetLocalVariableUsages()).ReturnsEmpty();

        // Act
        var result = await GetTarget().EvaluateAsync(ctx);

        result.Should().BeSameAs(innerResult.Object);
        var expect = new Dictionary<TrimmedRequiredString, Literal>();
        expect.Add("text", StringLiteral.Empty);
        expect.Add("count", NumberLiteral.Zero);
        expect.Add("isOk", BooleanLiteral.False);
        receivedVars.Should().Contain(expect);
        innerResult.VerifyWithAnyArgs(r => r.EvaluateAsync(null), Times.Never);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecreated_IfRemainingVariables()
    {
        innerResult.Setup(r => r.GetLocalVariableUsages()).Returns(new Dictionary<TrimmedRequiredString, LocalVariableInfo>
        {
            { "shouldRemain1", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: true) },
            { "shouldRemain2", new LocalVariableInfo(DslType.Number, isAssigned: false, isAccessed: true) },
        });

        // Act
        var result = (LocalVariableDeclaration)await GetTarget().EvaluateAsync(ctx);

        result.Inner.Should().BeSameAs(innerResult.Object);

        var expect = new Dictionary<TrimmedRequiredString, Literal>();
        expect.Add("shouldRemain1", StringLiteral.Empty);
        expect.Add("shouldRemain2", NumberLiteral.Zero);
        result.LocalVariableDefaults.Should().BeEquivalentTo(expect);
        innerResult.VerifyWithAnyArgs(r => r.EvaluateAsync(null), Times.Never);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldReevaluateToRemoveNotAssignedVariables()
    {
        innerResult.Setup(r => r.GetLocalVariableUsages()).Returns(new Dictionary<TrimmedRequiredString, LocalVariableInfo>
        {
            { "shouldBeRemoved", new LocalVariableInfo(DslType.String, isAssigned: true, isAccessed: false) },
            { "shouldRemain", new LocalVariableInfo(DslType.Number, isAssigned: true, isAccessed: true) },
        });

        var optimizedExpr = Mock.Of<IExpressionTree>();
        EvaluationContext optimizationCtx = null;
        innerResult.SetupWithAnyArgs(i => i.EvaluateAsync(null))
            .Callback<EvaluationContext>(c => optimizationCtx = c)
            .ReturnsAsync(optimizedExpr);

        // Act
        var result = (LocalVariableDeclaration)await GetTarget().EvaluateAsync(ctx);

        result.Inner.Should().BeSameAs(optimizedExpr);
        result.LocalVariableDefaults.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, Literal> { { "shouldRemain", NumberLiteral.Zero } });
        optimizationCtx.Mode.Should().Be(ExecutionMode.Sync);
        optimizationCtx.LocalVariables.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, Literal> { { "shouldRemain", NumberLiteral.Zero } });
        optimizationCtx.Trace.Should().BeNull();
    }

    [Fact]
    public void SerializeToClient_ShouldReturnClientDeclarationsWithAssignments()
    {
        inner.Setup(i => i.SerializeToClient()).Returns("innerCode()");

        // Act
        var result = GetTarget().SerializeToClient();

        result.Should().Be("var text='',count=0,isOk=false;innerCode()");
    }

    [Fact]
    public void GetChildren_ShouldReturnInner()
        => GetTarget().GetChildren().Should().BeEquivalentTo(inner.Object);

    [Fact]
    public void ToString_ShouldReturnVariableName()
    {
        inner.Setup(i => i.ToString()).Returns("innerCode");

        // Act
        GetTarget().ToString().Should().Be($"text := ''{Environment.NewLine}count := 0{Environment.NewLine}isOk := FALSE{Environment.NewLine}innerCode");
    }

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var (expr, equalExpr) = TestExpressionTree.GetEqual();
        var target = new LocalVariableDeclaration(expr, new Dictionary<TrimmedRequiredString, DslType> { { "whatever", DslType.String } });

        return new[]
        {
            new object[] { true, target, new LocalVariableDeclaration(equalExpr, new Dictionary<TrimmedRequiredString, DslType>()) },
            new object[] { false, target, new LocalVariableDeclaration(Mock.Of<IExpressionTree>(), new Dictionary<TrimmedRequiredString, DslType>()) },
        };
    }

    [Theory, MemberData(nameof(GetEqualityTestCases))]
    internal void Equals_ShouldCalculateCorrectly(bool expected, LocalVariableDeclaration arg1, LocalVariableDeclaration arg2)
        => EqualityTest.Run(expected, arg1, arg2);
}
