using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.FilterCondition;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.FilterCondition;

public class FilterConditionPreCachingProcessorTestsWithTracing() : FilterConditionPreCachingProcessorTests(true) { }

public class FilterConditionPreCachingProcessorTestsWithoutTracing() : FilterConditionPreCachingProcessorTests(false) { }

public abstract class FilterConditionPreCachingProcessorTests : PreCachingContentProcessorTestsBase
{
    private readonly TestLogger<FilterConditionPreCachingProcessor> log;

    protected FilterConditionPreCachingProcessorTests(bool useTrace)
        : base(useTrace)
    {
        dslCompiler = new Mock<IDslCompiler>();
        dslExpression = Mock.Of<IDslExpression<bool>>();
        log = new TestLogger<FilterConditionPreCachingProcessor>();
        Target = new FilterConditionPreCachingProcessor(dslCompiler.Object, log);

        SetupFilterableContent(condition: "Dsl.IsPassed");
    }

    private readonly Mock<IDslCompiler> dslCompiler;
    private readonly IDslExpression<bool> dslExpression;

    [Fact]
    public void ShouldReturnContentWithJitProcessor_IfValidCondition()
    {
        dslCompiler.Setup(c => c.Compile<bool>("Dsl.IsPassed"))
            .Returns(dslExpression.WithWarnings());

        var result = Target_Process(); // Act

        var doc = result.VerifySuccess(expectedMetadata: InputContent.Metadata);
        doc.Data.Fields.Should().Equal(new Dictionary<string, object>
        {
            { "Foo", "Bar" },
            { nameof(IFilterTemplate.Condition), null },
        });
        AddedJitProcessor.Should().BeOfType<FilterConditionJustInTimeProcessor>()
            .Which.DslCondition.Should().BeSameAs(dslExpression);
        log.VerifyNothingLogged();
        Trace?.Should().BeEquivalentOrderedTo(
            "Compiling filter Condition 'Dsl.IsPassed' to DSL expression.",
            "Compiled to following DSL expression with no warnings.",
            dslExpression);
    }

    [Fact]
    public void ShouldLogWarnings_FromDslCompilation()
    {
        var warnings = new[] { "Warn A", "Warn B" }.AsTrimmed();
        dslCompiler.Setup(c => c.Compile<bool>("Dsl.IsPassed"))
            .Returns(dslExpression.WithWarnings(warnings));

        Target_Process(); // Act

        log.Logged.Single().Verify(
            LogLevel.Warning,
            ("id", InputContent.Id),
            ("condition", "Dsl.IsPassed"),
            ("warnings", $"1) Warn A{Environment.NewLine}2) Warn B"));
        Trace?.Should().BeEquivalentOrderedTo(
            "Compiling filter Condition 'Dsl.IsPassed' to DSL expression.",
            "Compiled to following DSL expression with following warnings.",
            dslExpression,
            warnings);
    }

    [Fact]
    public void ShouldReturnSameContent_IfNotFilterable()
    {
        SetupContentFields(("Foo", "Bar"));

        RunAndExpectSameContent(); // Act

        dslCompiler.VerifyWithAnyArgs(c => c.Compile<bool>(null), Times.Never);
        AddedJitProcessor.Should().BeNull();
        log.VerifyNothingLogged();
        Trace?.Single().Should().Be(FilterConditionPreCachingProcessor.TraceMessages.NotFilterable);
    }

    [Theory, ValuesData(null, "", "  ")]
    public void ShouldReturnContentWithNullCondition_IfWhiteSpaceConditionField(string inputCondition)
    {
        SetupFilterableContent(inputCondition);

        var result = Target_Process(); // Act

        var doc = result.VerifySuccess(expectedMetadata: InputContent.Metadata);
        doc.Data.Fields.Should().Equal(new Dictionary<string, object>
        {
            { "Foo", "Bar" },
            { nameof(IFilterTemplate.Condition), null },
        });
        dslCompiler.VerifyWithAnyArgs(c => c.Compile<bool>(null), Times.Never);
        AddedJitProcessor.Should().BeNull();
        log.VerifyNothingLogged();
        Trace?.Single().Should().Be(FilterConditionPreCachingProcessor.TraceMessages.EmptyCondition);
    }

    [Fact]
    public void ShouldReturnInvalidContent_IfDslCompilationFailed()
    {
        var ex = new Exception("DSL error");
        dslCompiler.SetupWithAnyArgs(c => c.Compile<bool>(null)).Throws(ex);

        // Act
        RunAndExpectInvalidContent(ex.ToString(), "'Dsl.IsPassed'");

        Trace?.Should().BeEquivalentOrderedTo(
            $"Compiling filter {nameof(IFilterTemplate.Condition)} 'Dsl.IsPassed' to DSL expression.",
            FilterConditionPreCachingProcessor.TraceMessages.ErrorPrefix + ex);
    }

    private void SetupFilterableContent(string condition)
        => SetupContentFields(typeof(TestFilterableDocument), ("Foo", "Bar"), ("Condition", condition));
}
