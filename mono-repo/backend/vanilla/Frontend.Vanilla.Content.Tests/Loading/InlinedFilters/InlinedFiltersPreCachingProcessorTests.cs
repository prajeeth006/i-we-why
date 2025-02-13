using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.InlinedFilters;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.InlinedFilters;

public class InlinedFiltersPreCachingProcessorTestsWithTracing() : InlinedFiltersPreCachingProcessorTests(true) { }

public class InlinedFiltersPreCachingProcessorTestsWithoutTracing() : InlinedFiltersPreCachingProcessorTests(false) { }

public abstract class InlinedFiltersPreCachingProcessorTests : PreCachingContentProcessorTestsBase
{
    private readonly TestLogger<InlinedFiltersPreCachingProcessor> log;

    protected InlinedFiltersPreCachingProcessorTests(bool useTrace)
        : base(useTrace)
    {
        dslCompiler = new Mock<IDslCompiler>();
        log = new TestLogger<InlinedFiltersPreCachingProcessor>();
        Target = new InlinedFiltersPreCachingProcessor(dslCompiler.Object, log);

        SetupContentFields(
            ("Html Field 1", @"<ul><li data-content-filter='User.IsRetard'>Retard</li><li data-content-filter='User.IsGenius'>Genius</li><</ul>"),
            ("Not String", (RequiredString)"<div data-content-filter='User.IsVip'>Should be ignored because different type.</div>"),
            ("Html Field 2", "<div data-content-filter='User.IsGenius'>Welcome <span data-content-filter='  Assembly.IsVanilla  '>Vanilla</span> developer.</div>"),
            ("Html Without Filters", "<div>No filters here.</div>"),
            ("Other Type", 123));

        expr1 = Mock.Of<IDslExpression<bool>>();
        expr2 = Mock.Of<IDslExpression<bool>>();
        expr3 = Mock.Of<IDslExpression<bool>>();

        dslCompiler.Setup(c => c.Compile<bool>("User.IsRetard")).Returns(expr1.WithWarnings());
        dslCompiler.Setup(c => c.Compile<bool>("User.IsRetard")).Returns(expr1.WithWarnings());
        dslCompiler.Setup(c => c.Compile<bool>("User.IsGenius")).Returns(expr2.WithWarnings());
        dslCompiler.Setup(c => c.Compile<bool>("  Assembly.IsVanilla  ")).Returns(expr3.WithWarnings());
    }

    private readonly Mock<IDslCompiler> dslCompiler;
    private readonly IDslExpression<bool> expr1;
    private readonly IDslExpression<bool> expr2;
    private readonly IDslExpression<bool> expr3;

    [Fact]
    public void ShouldDiscoverAndCompileAllInlinedFilters()
    {
        RunAndExpectSameContent(); // Act

        var jitProcessor = (InlinedFiltersJustInTimeProcessor)AddedJitProcessor;
        jitProcessor.NamesOfFieldsWithFilters.Should().BeEquivalentTo(new List<TrimmedRequiredString> { { "Html Field 1" }, { "Html Field 2" } });
        jitProcessor.FilterExpressions.Should().BeEquivalentTo(new Dictionary<RequiredString, IDslExpression<bool>>
        {
            { "User.IsRetard", expr1 },
            { "User.IsGenius", expr2 },
            { "  Assembly.IsVanilla  ", expr3 },
        });

        dslCompiler.VerifyWithAnyArgs(c => c.Compile<bool>(null), Times.Exactly(4));
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldLogWarnings_FromDslCompilation()
    {
        dslCompiler.Setup(c => c.Compile<bool>("User.IsRetard")).Returns(expr1.WithWarnings("Warn 1.1", "Warn 1.2"));
        dslCompiler.Setup(c => c.Compile<bool>("  Assembly.IsVanilla  ")).Returns(expr2.WithWarnings("Warn 2"));

        RunAndExpectSameContent(); // Act

        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(
            LogLevel.Warning,
            ("id", InputContent.Id.ToString()),
            ("field", "Html Field 1"),
            ("filter", "User.IsRetard"),
            ("attribute", "data-content-filter"),
            ("warnings", $"1) Warn 1.1{Environment.NewLine}2) Warn 1.2"));
        log.Logged[1].Verify(
            LogLevel.Warning,
            ("id", InputContent.Id.ToString()),
            ("field", "Html Field 2"),
            ("filter", "  Assembly.IsVanilla  "),
            ("attribute", "data-content-filter"),
            ("warnings", "Warn 2"));
    }

    [Theory]
    [InlineData("", "<span data-content-filter=''>Lorem ipsum dolor sit")]
    [InlineData("  ", "<span data-content-filter='  '>Lorem ipsum dolor s")]
    public void ShouldReturnInvalidContent_IfWhiteSpaceFilterAttribute(string invalidAttributeValue, string reportedText)
    {
        SetupContentFields(("Invalid Field", $"<div>Hello <span data-content-filter='{invalidAttributeValue}'>Lorem ipsum dolor sit amet, consectetur adipiscing elit."));

        RunAndExpectInvalidContent( // Act
            $"Field 'Invalid Field' contains empty (hence invalid) inlined filter attribute 'data-content-filter' at position 11 with text '{reportedText}'.");
    }

    [Fact]
    public void ShouldReturnInvalidContent_IfDslCompilationFailed()
    {
        var ex = new Exception("DSL error");
        dslCompiler.SetupWithAnyArgs(c => c.Compile<bool>(null)).Throws(ex);

        RunAndExpectInvalidContent(ex); // Act
    }
}
