using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Proxy;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Proxy;

public class ProxyPreCachingContentProcessorTestsWithTracing() : ProxyPreCachingContentProcessorTests(true) { }

public class ProxyPreCachingContentProcessorTestsWithoutTracing() : ProxyPreCachingContentProcessorTests(false) { }

public abstract class ProxyPreCachingContentProcessorTests : PreCachingContentProcessorTestsBase
{
    protected ProxyPreCachingContentProcessorTests(bool useTrace)
        : base(useTrace)
    {
        dslCompiler = new Mock<IDslCompiler>();
        log = new TestLogger<ProxyPreCachingContentProcessor>();
        Target = new ProxyPreCachingContentProcessor(dslCompiler.Object, log);

        proxy = new Mock<IProxy>();
        expr1 = Mock.Of<IDslExpression<bool>>();
        expr2 = Mock.Of<IDslExpression<bool>>();

        proxy.SetupGet(p => p.Metadata).Returns(Metadata.Object);
        proxy.SetupGet(p => p.Target).Returns(new[] { new ProxyRule("Expr 1", "/target-1") });
        InputContent = new SuccessContent<IDocument>(proxy.Object);

        dslCompiler.Setup(c => c.Compile<bool>("Expr 1")).Returns(expr1.WithWarnings());
        dslCompiler.Setup(c => c.Compile<bool>("Expr 2")).Returns(expr2.WithWarnings());
    }

    private readonly TestLogger<ProxyPreCachingContentProcessor> log;
    private readonly Mock<IDslCompiler> dslCompiler;
    private readonly Mock<IProxy> proxy;

    private readonly IDslExpression<bool> expr1;
    private readonly IDslExpression<bool> expr2;

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void ShouldCompileProxyRules(string emptyCondition)
    {
        proxy.SetupGet(p => p.Target).Returns(new[]
        {
            new ProxyRule("Expr 1", "/target-1"),
            new ProxyRule("Expr 2", null),
            new ProxyRule(emptyCondition, "/target-3"),
            new ProxyRule("Expr 4", "/skipped"),
        });

        RunAndExpectSameContent(); // Act

        var proxyProcessor = (ProxyJustInTimeContentProcessor)JitProcessors.Single(); // Should remove previous processors
        proxyProcessor.ProxyRules.Should().BeEquivalentOrderedTo(
            new CompiledProxyRule(expr1, "/target-1"),
            new CompiledProxyRule(expr2, null),
            new CompiledProxyRule(null, "/target-3"));

        dslCompiler.VerifyWithAnyArgs(c => c.Compile<bool>(null), Times.Exactly(2));
        log.VerifyNothingLogged();
        Trace?.Should().BeEquivalentOrderedTo(
            ProxyPreCachingContentProcessor.TraceMessages.Preparing,
            proxy.Object.Target,
            $"Compiling {nameof(ProxyRule.Condition)} of the rule ('Expr 1' => /target-1 - zh-CN) to following DSL expression.",
            expr1,
            $"Compiling {nameof(ProxyRule.Condition)} of the rule ('Expr 2' => null) to following DSL expression.",
            expr2,
            $"No compilation of rule (null => /target-3 - zh-CN) because it has no {nameof(ProxyRule.Condition)} and remaining rules are skipped.",
            ProxyPreCachingContentProcessor.TraceMessages.Prepared,
            proxyProcessor.ProxyRules);
    }

    [Fact]
    public void ShouldLogWarnings_FromDslCompilation()
    {
        var dslResult = Mock.Of<IDslExpression<bool>>().WithWarnings("Warning 1", "Warning 2");
        dslCompiler.Setup(c => c.Compile<bool>("Expr 1")).Returns(dslResult);

        RunAndExpectSameContent(); // Act

        log.Logged.Single().Verify(
            LogLevel.Warning,
            ("id", InputContent.Id),
            ("condition", "Expr 1"),
            ("targetId", ((DocumentId)"/target-1").ToString()),
            ("warnings", $"1) Warning 1{Environment.NewLine}2) Warning 2"));
        Trace?.Should().ContainAll(
            ProxyPreCachingContentProcessor.TraceMessages.DslWarnings,
            dslResult.Warnings);
    }

    [Fact]
    public void ShouldReturnSameContent_IfNotProxy()
    {
        SetupContentFields(); // Sets up PCText

        RunAndExpectSameContent(); // Act

        VerifyNoDslLogicExecuted();
        Trace?.Single().Should().Be(ProxyPreCachingContentProcessor.TraceMessages.NotProxy);
    }

    [Fact]
    public void ShouldReturnFilteredContent_IfNoProxyRules()
    {
        proxy.SetupGet(p => p.Target).Returns(Array.Empty<ProxyRule>());

        var result = Target_Process(); // Act

        result.VerifyFiltered(expectedMetadata: InputContent.Metadata);
        VerifyNoDslLogicExecuted();
        Trace?.Single().Should().Be(ProxyPreCachingContentProcessor.TraceMessages.NoRules);
    }

    private void VerifyNoDslLogicExecuted()
    {
        AddedJitProcessor.Should().BeNull();
        dslCompiler.VerifyWithAnyArgs(c => c.Compile<bool>(null), Times.Never);
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldReturnInvalidContent_IfDslCompilationFailed()
    {
        var ex = new Exception("DSL error");
        dslCompiler.SetupWithAnyArgs(c => c.Compile<bool>(null)).Throws(ex);

        RunAndExpectInvalidContent(ex); // Act

        Trace?.Should().BeEquivalentOrderedTo(
            ProxyPreCachingContentProcessor.TraceMessages.Preparing,
            proxy.Object.Target,
            $"Compiling {nameof(ProxyRule.Condition)} of the rule ('Expr 1' => /target-1 - zh-CN) to following DSL expression.",
            ProxyPreCachingContentProcessor.ErrorPrefix + ex);
    }
}
