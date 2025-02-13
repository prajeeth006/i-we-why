using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Proxy;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Model.Implementation;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Proxy;

public class ProxyJustInTimeContentProcessorTestsWithTracing() : ProxyJustInTimeContentProcessorTests(true) { }

public class ProxyJustInTimeContentProcessorTestsWithoutTracing() : ProxyJustInTimeContentProcessorTests(false) { }

public abstract class ProxyJustInTimeContentProcessorTests : JustInTimeContentProcessorTestsBase, IDisposable
{
    protected ProxyJustInTimeContentProcessorTests(bool useTrace)
        : base(useTrace)
    {
        expr1 = new Mock<IDslExpression<bool>>();
        expr2 = new Mock<IDslExpression<bool>>();
        expr3 = new Mock<IDslExpression<bool>>();
        SetupTarget(
            new CompiledProxyRule(expr1.Object, "/target-1"),
            new CompiledProxyRule(expr2.Object, "/target-2"),
            new CompiledProxyRule(expr3.Object, "/target-3"));

        InputContent = new SuccessContent<IDocument>(new ProxyDocument(new DocumentData(InputContent.Metadata,
            new[] { KeyValue.Get(nameof(IProxy.Target), (object)null) })));
        ruleTargetContent = TestContent.Get<IDocument>();
        Loader.SetupWithAnyArgs(i => i.GetContentAsync(default, null, default, null)).ReturnsAsync(ruleTargetContent);

        SetupEvaluate(expr1, false);
        SetupEvaluate(expr2, false);
        SetupEvaluate(expr3, false);
    }

    private readonly Mock<IDslExpression<bool>> expr1;
    private readonly Mock<IDslExpression<bool>> expr2;
    private readonly Mock<IDslExpression<bool>> expr3;
    private readonly Content<IDocument> ruleTargetContent;

    private void SetupTarget(params CompiledProxyRule[] proxyRules)
        => Target = new ProxyJustInTimeContentProcessor(proxyRules);

    public void Dispose()
    {
        Loader.VerifyWithAnyArgs(l => l.GetContentAsync(default, null, default, null), Times.AtMostOnce);

        var oppositeDslEvaluation = Options.DslEvaluation == DslEvaluation.FullOnServer ? DslEvaluation.PartialForClient : DslEvaluation.FullOnServer;
        foreach (var expr in new[] { expr1, expr2, expr3 })
            VerifyEvaluate(expr, oppositeDslEvaluation, callCount: 0);
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldLoadItemFromFirstMatchingRule(DslEvaluation dslEvaluation)
    {
        SetupEvaluate(expr2, true);

        var result = await Target_ProcessAsync(dslEvaluation); // Act

        result.Should().BeSameAs(ruleTargetContent);
        Loader.Verify(l => l.GetContentAsync(Mode, "/target-2", Options, TraceFunc));

        VerifyEvaluate(expr1, dslEvaluation, callCount: 1);
        VerifyEvaluate(expr2, dslEvaluation, callCount: 1);
        VerifyEvaluate(expr3, dslEvaluation, callCount: 0);
        VerifyTrace_SecondRuleMatched();
    }

    private void VerifyTrace_SecondRuleMatched()
        => Trace?.Should().BeEquivalentOrderedTo(FirstTraceMsgs.Append(
            $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr1.Object}.",
            ProxyJustInTimeContentProcessor.TraceMessages.RuleNotMatched,
            $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr2.Object}.",
            "The rule matched so loading its target instead: /target-2 - zh-CN."));

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldMatchNullCondition(DslEvaluation dslEvaluation)
    {
        SetupTarget(
            new CompiledProxyRule(null, "target-1"),
            new CompiledProxyRule(expr2.Object, "target-2"));

        var result = await Target_ProcessAsync(dslEvaluation); // Act

        result.Should().BeSameAs(ruleTargetContent);
        VerifyEvaluate(expr2, dslEvaluation, callCount: 0);
        Loader.Verify(l => l.GetContentAsync(Mode, "target-1", Options, TraceFunc));
        Trace?.Should().BeEquivalentOrderedTo(FirstTraceMsgs.Append(
            $"Evaluating rule with {nameof(ProxyRule.Condition)} null.",
            "The rule matched so loading its target instead: /target-1 - zh-CN."));
    }

    [Theory]
    [InlineData(DslEvaluation.FullOnServer, ProxyJustInTimeContentProcessor.TraceMessages.FilteredFullOnServer)]
    [InlineData(DslEvaluation.PartialForClient, ProxyJustInTimeContentProcessor.TraceMessages.FilteredPartialForClient)]
    public async Task ShouldReturnFiltered_IfNoRuleMatched(DslEvaluation dslEvaluation, string expectedTraceMsg)
        => await RunAndExpectFiltered(dslEvaluation, expectedTraceMsg);

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldReturnFiltered_IfTargetIdEqualsNull(DslEvaluation dslEvaluation)
    {
        SetupTarget(
            new CompiledProxyRule(expr1.Object, null),
            new CompiledProxyRule(expr2.Object, "target-2"));
        SetupEvaluate(expr1, true);

        // Act
        await RunAndExpectFiltered(dslEvaluation, ProxyJustInTimeContentProcessor.TraceMessages.FilteredRuleNullTarget);

        VerifyEvaluate(expr1, dslEvaluation, callCount: 1);
        VerifyEvaluate(expr2, dslEvaluation, callCount: 0);
    }

    private async Task RunAndExpectFiltered(DslEvaluation dslEvaluation, string expectedTraceMsg)
    {
        var result = await Target_ProcessAsync(dslEvaluation); // Act

        result.VerifyFiltered(expectedMetadata: InputContent.Metadata);
        Trace?.Last().Should().Be(expectedTraceMsg);
    }

    [Theory, EnumData(typeof(DslEvaluation))]
    public async Task ShouldHandleDslEvaluationError(DslEvaluation dslEvaluation)
    {
        var ex = new DslEvaluationException("Eval error.");
        if (dslEvaluation == DslEvaluation.FullOnServer) expr1.Setup(e => e.EvaluateAsync(Mode)).ThrowsAsync(ex);
        else expr1.Setup(e => e.EvaluateForClientAsync(Mode)).ThrowsAsync(ex);

        // Act
        var result = await Target_ProcessAsync(dslEvaluation);

        result.Metadata.Should().BeSameAs(InputContent.Metadata);
        result.Should().BeOfType<InvalidContent<IDocument>>()
            .Which.Errors.Should().Equal(ProxyJustInTimeContentProcessor.ErrorPrefix + ex);
        Trace?.Should().BeEquivalentOrderedTo(FirstTraceMsgs.Append(
            $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr1.Object}.",
            ProxyJustInTimeContentProcessor.ErrorPrefix + ex));
    }

    [Fact]
    public async Task ShouldLoadItem_IfClientDslEvaluation_AndFirstRuleForClientIsFullyMatched()
    {
        expr1.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(false));
        expr2.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(true));

        var result = await Target_ProcessAsync(DslEvaluation.PartialForClient); // Act

        result.Should().BeSameAs(ruleTargetContent);
        Loader.Verify(l => l.GetContentAsync(Mode, "target-2", Options, TraceFunc));
        expr3.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
        VerifyTrace_SecondRuleMatched();
    }

    [Fact]
    public async Task ShouldRecreateProxy_IfClientDslEvaluation_ExcludingRulesAfterFirstFullyMatched()
    {
        expr1.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromClientExpression("client-expr-1"));
        expr2.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(true));

        await RunAndExpectProxyWithRulesAsync(
            expectedRules: new[]
            {
                new ProxyRule("client-expr-1", "target-1"),
                new ProxyRule(null, "target-2"),
            },
            expectedTrace: new[]
            {
                $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr1.Object}.",
                "The rule evaluated to client expression 'client-expr-1'.",
                $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr2.Object}.",
                ProxyJustInTimeContentProcessor.TraceMessages.RuleMatchedAsLastForClient,
            });

        expr3.VerifyWithAnyArgs(e => e.EvaluateForClientAsync(default(ExecutionMode)), Times.Never);
    }

    [Fact]
    public async Task ShouldRecreateProxy_IfClientDslEvaluation_IncludingNullTarget_ExcludingFullyUnmatchedRules()
    {
        SetupTarget(
            new CompiledProxyRule(expr1.Object, "target-1"), // Unmatched
            new CompiledProxyRule(expr2.Object, null)); // Null target
        expr2.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromClientExpression("client-expr-2"));

        await RunAndExpectProxyWithRulesAsync(
            expectedRules: new[]
            {
                new ProxyRule("client-expr-2", null),
            },
            expectedTrace: new[]
            {
                $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr1.Object}.",
                ProxyJustInTimeContentProcessor.TraceMessages.RuleNotMatched,
                $"Evaluating rule with {nameof(ProxyRule.Condition)} {expr2.Object}.",
                "The rule evaluated to client expression 'client-expr-2'.",
            });
    }

    private async Task RunAndExpectProxyWithRulesAsync(ProxyRule[] expectedRules, string[] expectedTrace)
    {
        // Act
        var result = await Target_ProcessAsync(DslEvaluation.PartialForClient); // Act

        var doc = result.VerifySuccess(expectedMetadata: InputContent.Metadata);
        doc.Should().BeAssignableTo<IProxy>()
            .Which.Target.Should().BeEquivalentOrderedTo(expectedRules);

        Trace?.Should().BeEquivalentOrderedTo(FirstTraceMsgs
            .Concat(expectedTrace)
            .Append(ProxyJustInTimeContentProcessor.TraceMessages.ClientProxy, expectedRules));
    }

    [Fact]
    public void Ctor_ShouldFail_IfNoProxyRules()
        => new Action(() => SetupTarget())
            .Should().Throw<ArgumentException>();

    private Task<Content<IDocument>> Target_ProcessAsync(DslEvaluation dslEvaluation)
    {
        Options = TestContentLoadOptions.Get(dslEvaluation);

        return Target_ProcessAsync();
    }

    private IEnumerable<object> FirstTraceMsgs => new object[]
    {
        $"Evaluating {Options.DslEvaluation} proxy with following rules.",
        ((ProxyJustInTimeContentProcessor)Target).ProxyRules,
    };

    private void SetupEvaluate(Mock<IDslExpression<bool>> expr, bool result)
    {
        expr.Setup(e => e.EvaluateAsync(Mode)).ReturnsAsync(result);
        expr.Setup(e => e.EvaluateForClientAsync(Mode)).ReturnsAsync(ClientEvaluationResult<bool>.FromValue(result));
    }

    private void VerifyEvaluate(Mock<IDslExpression<bool>> expr, DslEvaluation dslEvaluation, int callCount)
    {
        var times = Times.Exactly(callCount);
        var expectedMode = callCount == 0 ? It.IsAny<ExecutionMode>() : Mode;

        if (dslEvaluation == DslEvaluation.FullOnServer)
            expr.Verify(e => e.EvaluateAsync(expectedMode), times);
        else
            expr.Verify(e => e.EvaluateForClientAsync(expectedMode), times);
    }
}
