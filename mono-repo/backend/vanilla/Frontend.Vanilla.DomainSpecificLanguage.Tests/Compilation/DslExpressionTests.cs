using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.ExpressionTree;
using Frontend.Vanilla.DomainSpecificLanguage.Tests.Fakes;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Compilation;

public class DslExpressionTests
{
    private readonly DslExpressionMetadata metadata;
    private readonly Mock<IExpressionTree> exprTree;
    private readonly Mock<ITraceRecorder> traceRecorder;
    private readonly IRecordingTrace trace;
    private readonly ExecutionMode mode;

    public DslExpressionTests()
    {
        metadata = new DslExpressionMetadata();
        exprTree = new Mock<IExpressionTree>();
        traceRecorder = new Mock<ITraceRecorder>();
        trace = Mock.Of<IRecordingTrace>();
        mode = TestExecutionMode.Get();

        exprTree.Setup(e => e.CreateMetadata()).Returns(metadata);
        exprTree.Setup(e => e.ResultType).Returns(DslType.Number); // Different name from corresponding CLR type -> used in messages
        traceRecorder.Setup(r => r.GetRecordingTrace()).Returns(trace);
    }

    private DslExpression<T> GetTarget<T>(string originalStr = "raw expr")
        => new DslExpression<T>(originalStr, exprTree.Object, traceRecorder.Object);

    [Fact]
    public void Constructor_ShouldCreateForReferenceType() => RunCtorTest<string>(DslType.String);

    [Fact]
    public void Constructor_ShouldUpcastForReferenceType() => RunCtorTest<IEnumerable<char>>(DslType.String);

    [Fact]
    public void Constructor_ShouldCreateForValueType() => RunCtorTest<bool>(DslType.Boolean);

    [Fact]
    public void Constructor_ShouldUpcastForValueType() => RunCtorTest<object>(DslType.Boolean);

    private void RunCtorTest<T>(DslType exprType)
    {
        exprTree.Setup(e => e.ResultType).Returns(exprType);

        // Act
        var target = GetTarget<T>();

        target.OriginalString.Should().Be("raw expr");
        target.Metadata.Should().BeSameAs(metadata);
        target.ExpressionTree.Should().BeSameAs(exprTree.Object);
        target.TraceRecorder.Should().BeSameAs(traceRecorder.Object);
        traceRecorder.Verify(r => r.GetRecordingTrace(), Times.Never);
    }

    [Fact]
    public void Constructor_ShouldThrow_IfIncompatibleType()
        => new Action(() => GetTarget<bool>())
            .Should().Throw()
            .Which.Message.Should().ContainAll(typeof(bool), DslType.Number, typeof(decimal));

    [Fact]
    public Task EvaluateAsync_ShouldReturnReferenceType()
        => RunEvaluateAsyncTest<string>(StringLiteral.Get("LOL"));

    [Fact]
    public Task EvaluateAsync_ShouldUpcastReferenceType()
        => RunEvaluateAsyncTest<IEnumerable<char>>(StringLiteral.Get("LOL"));

    [Fact]
    public Task EvaluateAsync_ShouldReturnValueType()
        => RunEvaluateAsyncTest<decimal>(NumberLiteral.Get(666));

    [Fact]
    public Task EvaluateAsync_ShouldUpcastValueType()
        => RunEvaluateAsyncTest<object>(NumberLiteral.Get(666));

    private async Task RunEvaluateAsyncTest<TResult>(Literal evalResult)
    {
        exprTree.Setup(e => e.ResultType).Returns(evalResult.ResultType);
        exprTree.Setup(e => e.EvaluateAsync(ItIsContext(DslEvaluation.FullOnServer))).ReturnsAsync(evalResult);
        var target = GetTarget<TResult>();

        // Act
        var value = await target.EvaluateAsync(mode);

        value.Should().Be(evalResult.GetValue<object>());
    }

    [Theory, MemberData(nameof(EvalErrorTestCases))]
    public void EvaluateAsync_ShouldThrow_IfEvaluationFailed(string exprStr, string reportedExpr)
        => RunEvalErrorTest(DslEvaluation.FullOnServer, t => t.EvaluateAsync(mode), exprStr, reportedExpr);

    [Fact]
    public Task EvaluateForClientAsync_ShouldReturnReferenceType_IfAlreadyFinal()
        => RunEvaluateForClientAsyncTest<string>(StringLiteral.Get("LOL"));

    [Fact]
    public Task EvaluateForClientAsync_ShouldUpcastReferenceType_IfAlreadyFinal()
        => RunEvaluateForClientAsyncTest<IEnumerable<char>>(StringLiteral.Get("LOL"));

    [Fact]
    public Task EvaluateForClientAsync_ShouldReturnValueType_IfAlreadyFinal()
        => RunEvaluateForClientAsyncTest<decimal>(NumberLiteral.Get(666));

    [Fact]
    public Task EvaluateForClientAsync_ShouldUpcastValueType_IfAlreadyFinal()
        => RunEvaluateForClientAsyncTest<decimal>(NumberLiteral.Get(666));

    private async Task RunEvaluateForClientAsyncTest<TResult>(Literal evalResult)
    {
        exprTree.Setup(e => e.ResultType).Returns(evalResult.ResultType);
        exprTree.Setup(e => e.EvaluateAsync(ItIsContext(DslEvaluation.PartialForClient))).ReturnsAsync(evalResult);
        var target = GetTarget<TResult>();

        // Act
        var result = await target.EvaluateForClientAsync(mode);

        result.Value.Should().Be(evalResult.GetValue<object>());
    }

    [Fact]
    public async Task EvaluateForClient_ShouldReturnClientExpression_IfNotFinalYet()
    {
        var clientExprTree = new Mock<IExpressionTree>();
        var target = GetTarget<object>();
        exprTree.Setup(e => e.EvaluateAsync(ItIsContext(DslEvaluation.PartialForClient))).ReturnsAsync(clientExprTree.Object);
        clientExprTree.Setup(s => s.SerializeToClient()).Returns("client-expr");

        // Act
        var result = await target.EvaluateForClientAsync(mode);

        result.ClientExpression.Should().Be("client-expr");
    }

    [Theory, MemberData(nameof(EvalErrorTestCases))]
    public void EvaluateForClientAsync_ShouldThrow_IfEvaluationFailed(string exprStr, string reportedExpr)
        => RunEvalErrorTest(DslEvaluation.PartialForClient, t => t.EvaluateForClientAsync(mode), exprStr, reportedExpr);

    public static TheoryData<string, string> EvalErrorTestCases => new TheoryData<string, string>
    {
        { "test expr", "'test expr'" },
        {
            "fdsgfhdghjgdljnkglflhgfkbposdfnbmsfmnbpfksbnkffdsgfhdghjgdljnkglflhgfkbposdfnbmsfmnbpfksbnkffdsgfhdghjgdljnkglflhgfkbposdfnbmsfmnbpfksbnkf",
            "'fdsgfhdghjgdljnkglflhgfkbposdfnbmsfmnbpfksbnkffdsgfhdghjgdljnkglflhgfkbposdfnbmsfmnbpfksbnkffdsgfhdg...' (full version is in Data)"
        },
    };

    private void RunEvalErrorTest(DslEvaluation evaluation, Func<DslExpression<object>, Task> evaluate, string exprStr, string reportedExpr)
    {
        var target = GetTarget<object>(exprStr);
        var evalEx = new Exception("Oups");
        exprTree.Setup(e => e.EvaluateAsync(ItIsContext(evaluation))).ThrowsAsync(evalEx);

        var act = () => evaluate(target);

        act.Should().ThrowAsync<DslEvaluationException>().Result
            .WithMessage($"Failed {evaluation} runtime evaluation of DSL expression {reportedExpr} of type Number.")
            .Where(e => e.InnerException == evalEx)
            .Which.Data["DslExpression"].Should().Be(exprStr);
    }

    [Fact]
    public void ToString_ShouldOutputParseTree()
    {
        exprTree.Setup(e => e.ToString()).Returns("oak tree");
        GetTarget<object>().ToString().Should().Be("oak tree");
    }

    public static IEnumerable<object[]> GetEqualityTestCases()
    {
        var (expr, equalExpr) = TestExpressionTree.GetEqual();
        var traceRecorder = Mock.Of<ITraceRecorder>();
        var target = new DslExpression<string>("whatever", expr, traceRecorder);

        return new[]
        {
            new object[] { true, target, new DslExpression<string>("expr", equalExpr, traceRecorder) },
            new object[] { true, target, new DslExpression<string>("expr", equalExpr, Mock.Of<ITraceRecorder>()) }, // TraceRecorder should be insignificant
            new object[] { false, target, new DslExpression<object>("expr", equalExpr, Mock.Of<ITraceRecorder>()) }, // Different result type
            new object[] { false, target, new DslExpression<string>("expr", Mock.Of<IExpressionTree>(), Mock.Of<ITraceRecorder>()) },
        };
    }

    [Theory, MemberData(nameof(GetEqualityTestCases))]
    public void Equals_ShouldCalculateCorrectly(bool expected, object arg1, object arg2)
        => EqualityTest.Run(expected, arg1, arg2);

    [Fact]
    public void Equals_ShouldNotEqualToOtherValues()
        => EqualityTest.RunWithOtherValues(new DslExpression<string>("expr", Mock.Of<IExpressionTree>(), Mock.Of<ITraceRecorder>()));

    private EvaluationContext ItIsContext(DslEvaluation evaluation)
        => It.Is<EvaluationContext>(c =>
            c.Mode.Equals(mode)
            && c.Evaluation == evaluation
            && ReferenceEquals(c.Trace, trace)
            && c.LocalVariables.Count == 0);
}
