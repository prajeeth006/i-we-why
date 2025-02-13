using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public class DslExpressionBaseTests
{
    private IDslExpression<string> target;
    private Mock<DslExpressionBase<string>> underlyingMock;

    private CancellationToken ct;
    private ClientEvaluationResult<string> clientResult;

    public DslExpressionBaseTests()
    {
        underlyingMock = new Mock<DslExpressionBase<string>>();
        target = underlyingMock.Object;

        ct = TestCancellationToken.Get();
        clientResult = ClientEvaluationResult<string>.FromValue("gvc");
    }

    [Fact]
    public void Evaluate_ShouldDelegateToExecutionMode()
    {
        underlyingMock.Setup(m => m.EvaluateAsync(ExecutionMode.Sync)).ReturnsAsync("bwin");

        // Act
        var result = target.Evaluate();

        result.Should().Be("bwin");
    }

    [Fact]
    public async Task EvaluateAsync_ShouldDelegateToExecutionMode()
    {
        underlyingMock.Setup(m => m.EvaluateAsync(ExecutionMode.Async(ct))).ReturnsAsync("bwin");

        // Act
        var result = await target.EvaluateAsync(ct);

        result.Should().Be("bwin");
    }

    [Fact]
    public void EvaluateForClient_ShouldDelegateToExecutionMode()
    {
        underlyingMock.Setup(m => m.EvaluateForClientAsync(ExecutionMode.Sync)).ReturnsAsync(clientResult);

        // Act
        var result = target.EvaluateForClient();

        result.Should().BeSameAs(clientResult);
    }

    [Fact]
    public async Task EvaluateForClientAsync_ShouldDelegateToExecutionMode()
    {
        underlyingMock.Setup(m => m.EvaluateForClientAsync(ExecutionMode.Async(ct))).ReturnsAsync(clientResult);

        // Act
        var result = await target.EvaluateForClientAsync(ct);

        result.Should().BeSameAs(clientResult);
    }
}
