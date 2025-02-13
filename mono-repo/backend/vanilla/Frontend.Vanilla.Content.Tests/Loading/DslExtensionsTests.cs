using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading;

public class DslExtensionsTests
{
    private Mock<IDslExpression<int>> expr1;
    private Mock<IDslExpression<int>> expr2;
    private ExecutionMode mode;

    public DslExtensionsTests()
    {
        expr1 = new Mock<IDslExpression<int>>();
        expr2 = new Mock<IDslExpression<int>>();
        mode = TestExecutionMode.Get();
    }

    private Task<Dictionary<IDslExpression<int>, ClientEvaluationResult<int>>> RunTest(DslEvaluation dslEvaluation)
    {
        var options = TestContentLoadOptions.Get(dslEvaluation);
        var exprs = new[] { expr1.Object, expr2.Object };

        return exprs.EvaluateAllAsync(mode, options); // Act
    }

    [Fact]
    public async Task ShouldEvaluateForServerAsync()
    {
        expr1.Setup(e => e.EvaluateAsync(mode)).ReturnsAsync(111);
        expr2.Setup(e => e.EvaluateAsync(mode)).ReturnsAsync(222);

        var results = await RunTest(DslEvaluation.FullOnServer); // Act

        results.Should().BeEquivalentTo(new Dictionary<IDslExpression<int>, ClientEvaluationResult<int>>
        {
            { expr1.Object, ClientEvaluationResult<int>.FromValue(111) },
            { expr2.Object, ClientEvaluationResult<int>.FromValue(222) },
        });
    }

    [Fact]
    public async Task ShouldEvaluateForClientAsync()
    {
        var clientValue1 = ClientEvaluationResult<int>.FromValue(111);
        var clientValue2 = ClientEvaluationResult<int>.FromClientExpression("value2");
        expr1.Setup(e => e.EvaluateForClientAsync(mode)).ReturnsAsync(clientValue1);
        expr2.Setup(e => e.EvaluateForClientAsync(mode)).ReturnsAsync(clientValue2);

        var results = await RunTest(DslEvaluation.PartialForClient); // Act

        results.Should().BeEquivalentTo(new Dictionary<IDslExpression<int>, ClientEvaluationResult<int>>
        {
            { expr1.Object, clientValue1 },
            { expr2.Object, clientValue2 },
        });
    }

    [Fact]
    public void ShouldExecuteInParallel()
    {
        var tcs1 = new TaskCompletionSource<int>();
        var tcs2 = new TaskCompletionSource<int>();
        var runningCount = 0;
        expr1.Setup(e => e.EvaluateAsync(mode)).Returns(() =>
        {
            runningCount++;

            return tcs1.Task;
        });
        expr2.Setup(e => e.EvaluateAsync(mode)).Returns(() =>
        {
            runningCount++;

            return tcs2.Task;
        });

        RunTest(DslEvaluation.FullOnServer); // Act

        runningCount.Should().Be(2);
    }
}
