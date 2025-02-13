using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public class DslActionTests
{
    private IDslAction target;
    private Mock<IDslExpression<VoidDslResult>> expression;

    private CancellationToken ct;
    private ExecutionMode mode;

    public DslActionTests()
    {
        expression = new Mock<IDslExpression<VoidDslResult>>();
        target = new DslAction(expression.Object);

        ct = TestCancellationToken.Get();
        mode = TestExecutionMode.Get();
    }

    [Fact]
    public void Expression_ShouldBeExposed()
        => ((DslAction)target).Expression.Should().BeSameAs(expression.Object);

    [Fact]
    public void OriginalString_ShouldDelegate()
    {
        expression.SetupGet(e => e.OriginalString).Returns("expr");

        // Act
        target.OriginalString.Should().Be("expr");
    }

    [Fact]
    public void Metadata_ShouldDelegate()
    {
        var metadata = new DslExpressionMetadata();
        expression.SetupGet(e => e.Metadata).Returns(metadata);

        // Act
        target.Metadata.Should().BeSameAs(metadata);
    }

    [Fact]
    public void Execute_ShouldDelegate()
    {
        // Act
        target.Execute();

        expression.Verify(e => e.Evaluate());
    }

    [Fact]
    public async Task ExecuteAsync_CancellationToken_ShouldDelegate()
    {
        // Act
        await target.ExecuteAsync(ct);

        expression.Verify(e => e.EvaluateAsync(ct));
    }

    [Fact]
    public async Task ExecuteAsync_ExecutionMode_ShouldDelegate()
    {
        // Act
        await target.ExecuteAsync(mode);

        expression.Verify(e => e.EvaluateAsync(mode));
    }

    public static IEnumerable<object[]> ClientTestCases => new[]
    {
        new object[] { ClientEvaluationResult<VoidDslResult>.FromValue(VoidDslResult.Singleton), null },
        new object[] { ClientEvaluationResult<VoidDslResult>.FromClientExpression("client-expr"), "client-expr" },
    };

    [Theory, MemberData(nameof(ClientTestCases))]
    internal void ExecuteToClientScript_ShouldDelegate(ClientEvaluationResult<VoidDslResult> clientResult, string expected)
    {
        expression.Setup(e => e.EvaluateForClient()).Returns(clientResult);

        // Act
        target.ExecuteToClientScript().Should().Be(expected);
    }

    [Theory, MemberData(nameof(ClientTestCases))]
    internal async Task ExecuteToClientScriptAsync_CancellationToken_ShouldDelegate(ClientEvaluationResult<VoidDslResult> clientResult, string expected)
    {
        expression.Setup(e => e.EvaluateForClientAsync(ct)).ReturnsAsync(clientResult);

        // Act
        (await target.ExecuteToClientScriptAsync(ct)).Should().Be(expected);
    }

    [Theory, MemberData(nameof(ClientTestCases))]
    internal async Task ExecuteToClientScriptAsync_ExecutionMode_ShouldDelegate(ClientEvaluationResult<VoidDslResult> clientResult, string expected)
    {
        expression.Setup(e => e.EvaluateForClientAsync(mode)).ReturnsAsync(clientResult);

        // Act
        (await target.ExecuteToClientScriptAsync(mode)).Should().Be(expected);
    }

    [Fact]
    public void ToString_ShouldDelegate()
    {
        expression.Setup(e => e.ToString()).Returns("debug");

        // Act
        target.ToString().Should().Be("debug");
    }

    [Theory, BooleanData]
    public void Equals_ShouldDelegate(bool equal)
    {
        var otherExpr = new Mock<IDslExpression<VoidDslResult>>();
        var other = new DslAction(otherExpr.Object);
        otherExpr.Setup(e => e.Equals(expression.Object)).Returns(equal);

        // Act
        target.Equals(other).Should().Be(equal);
    }

    [Fact]
    public void GetHashCode_ShouldDelegate()
    {
        expression.Setup(e => e.GetHashCode()).Returns(123);

        // Act
        target.GetHashCode().Should().Be(123);
    }
}
