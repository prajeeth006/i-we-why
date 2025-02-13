using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Tracing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Tracing;

public class TracedDslExpressionTests
{
    private DslExpressionBase<string> target;
    private Mock<IDslExpression<string>> inner;
    private TestRecordingTrace trace;
    private ExecutionMode mode;

    public TracedDslExpressionTests()
    {
        inner = new Mock<IDslExpression<string>>();
        var traceRecorder = new Mock<ITraceRecorder>();
        target = new TracedDslExpression<string>(inner.Object, traceRecorder.Object);

        trace = new TestRecordingTrace();
        mode = TestExecutionMode.Get();

        inner.SetupGet(i => i.OriginalString).Returns("expr");
        traceRecorder.Setup(r => r.GetRecordingTrace()).Returns(() => trace);
    }

    [Fact]
    public void OriginalString_ShouldDelegate()
        => target.OriginalString.Value.Should().Be("expr"); // Act

    [Fact]
    public void Metadata_ShouldDelegate()
    {
        var metadata = new DslExpressionMetadata();
        inner.SetupGet(i => i.Metadata).Returns(metadata);

        // Act
        target.Metadata.Should().BeSameAs(metadata);
    }

    [Fact]
    public async Task EvaluateAsync_ShouldRecordTrace()
    {
        inner.Setup(i => i.EvaluateAsync(mode)).ReturnsAsync("abc");

        await RunTestAsync(target.EvaluateAsync, // Act
            expectedResult: "abc",
            tracedEvaluation: "FullOnServer",
            tracedResult: @"""abc""");
    }

    [Fact]
    public void EvaluateAsync_ShouldRecordException()
    {
        var ex = new Exception("Oups");
        inner.Setup(i => i.EvaluateAsync(mode)).ThrowsAsync(ex);

        RunExceptionTest(() => target.EvaluateAsync(mode), // Act
            ex,
            "FullOnServer");
    }

    [Fact]
    public void EvaluateAsync_ShouldNotTrace_IfDisabled()
    {
        var testTask = Task.FromResult("abc");
        inner.Setup(i => i.EvaluateAsync(mode)).Returns(testTask);
        trace = null;

        var task = target.EvaluateAsync(mode); // Act

        task.Should().BeSameAs(testTask);
    }

    public static readonly IEnumerable<object[]> ClientTestCases = new[]
    {
        new object[] { ClientEvaluationResult<string>.FromValue("abc"), @"{""HasFinalValue"":true,""Value"":""abc""}" },
        new object[] { ClientEvaluationResult<string>.FromClientExpression("ee"), @"{""HasFinalValue"":false,""ClientExpression"":""ee""}" },
    };

    [Theory]
    [MemberData(nameof(ClientTestCases))]
    public async Task EvaluateForClientAsync_ShouldRecordTrace(ClientEvaluationResult<string> mockedResult, string expectedTracedResult)
    {
        inner.Setup(i => i.EvaluateForClientAsync(mode)).ReturnsAsync(mockedResult);

        await RunTestAsync(target.EvaluateForClientAsync, // Act
            mockedResult,
            tracedEvaluation: "PartialForClient",
            expectedTracedResult);
    }

    [Fact]
    public void EvaluateForClientAsync_ShouldRecordException()
    {
        var ex = new Exception("Oups");
        inner.Setup(i => i.EvaluateForClientAsync(mode)).ThrowsAsync(ex);

        RunExceptionTest(() => target.EvaluateForClientAsync(mode), // Act,
            ex,
            "PartialForClient");
    }

    [Fact]
    public void EvaluateForClientAsync_ShouldNotTrace_IfDisabled()
    {
        var testTask = Task.FromResult(ClientEvaluationResult<string>.FromValue("abc"));
        inner.Setup(i => i.EvaluateForClientAsync(mode)).Returns(testTask);
        trace = null;

        var task = target.EvaluateForClientAsync(mode); // Act

        task.Should().BeSameAs(testTask);
    }

    private async Task RunTestAsync<T>(Func<ExecutionMode, Task<T>> act, T expectedResult, string tracedEvaluation, string tracedResult)
    {
        var result = await act(mode); // Act

        result.Should().BeSameAs(expectedResult);
        trace.Recorded.Single().Verify(
            "DSL expression success: expr",
            ("expression", "expr"),
            ("evaluation", tracedEvaluation),
            ("executionMode", mode.ToString()),
            ("evaluationResult", tracedResult));
    }

    private void RunExceptionTest(Func<Task> act, Exception ex, string evaluation)
    {
        act.Should().ThrowAsync<Exception>().Result.Which.Should().BeSameAs(ex);
        trace.Recorded.Single().Verify(
            "DSL expression failure: expr",
            ex,
            ("expression", "expr"),
            ("evaluation", evaluation),
            ("executionMode", mode.ToString()));
    }

    [Fact]
    public void ToString_ShouldDelegate()
    {
        inner.Setup(i => i.ToString()).Returns("ss");
        target.ToString().Should().Be("ss"); // Act
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void Equals_ShouldUnwrapAndDelegate_IfSameType(bool isEqual)
    {
        var otherInner = Mock.Of<IDslExpression<string>>();
        var other = new TracedDslExpression<string>(otherInner, Mock.Of<ITraceRecorder>());
        inner.Setup(i => i.Equals(otherInner)).Returns(isEqual);

        var result = target.Equals(other); // Act

        result.Should().Be(isEqual);
    }

    [Fact]
    public void Equals_ShouldReturnFalse_IfOtherType()
    {
        foreach (var obj in new object[] { null, "s", Mock.Of<IDslExpression<string>>(), inner.Object })
            target.Equals(obj).Should().BeFalse(); // Act
    }

    [Fact]
    public void GetHashCode_ShouldDelegate()
    {
        inner.Setup(i => i.GetHashCode()).Returns(123);
        target.GetHashCode().Should().Be(123); // Act
    }
}
