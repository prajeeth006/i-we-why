using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Placeholders;
using Frontend.Vanilla.Content.Placeholders;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Placeholders;

public class PlaceholdersPreCachingProcessorTestsWithTracing() : PlaceholdersPreCachingProcessorTests(true) { }

public class PlaceholdersPreCachingProcessorTestsWithoutTracing() : PlaceholdersPreCachingProcessorTests(false) { }

public abstract class PlaceholdersPreCachingProcessorTests : PreCachingContentProcessorTestsBase
{
    private readonly TestLogger<PlaceholdersPreCachingProcessor> log;

    protected PlaceholdersPreCachingProcessorTests(bool useTrace)
        : base(useTrace)
    {
        placeholderCompiler = new Mock<IPlaceholderCompiler>();
        fieldReplacer1 = new Mock<IFieldPlaceholderReplacer>();
        fieldReplacer2 = new Mock<IFieldPlaceholderReplacer>();
        replacer = Mock.Of<IPlaceholderReplacer>();
        log = new TestLogger<PlaceholdersPreCachingProcessor>();
        Target = new PlaceholdersPreCachingProcessor(placeholderCompiler.Object, new[] { fieldReplacer1.Object, fieldReplacer2.Object }, replacer, log);

        SetupContentFields(
            ("Incompatible", 123),
            ("Null", null),
            ("StrField 1", "Test 1"),
            ("StrField 2", "Test 2"),
            ("FooField", foo = new Foo()));

        fieldReplacer1.SetupGet(r => r.FieldType).Returns(typeof(string));
        fieldReplacer2.SetupGet(r => r.FieldType).Returns(typeof(IFoo));
        fieldReplacer1.Setup(r => r.GetReplaceableStrings("Test 1")).Returns(new[] { "Str 1.1", "Str 1.2" });
        fieldReplacer1.Setup(r => r.GetReplaceableStrings("Test 2")).Returns(Array.Empty<string>());
        fieldReplacer2.Setup(r => r.GetReplaceableStrings(foo)).Returns(new[] { "Str 2" });
        placeholderCompiler.SetupWithAnyArgs(c => c.FindPlaceholders(null)).Returns(EmptyDictionary<TrimmedRequiredString, IDslExpression<object>>.Singleton);
    }

    private readonly Mock<IPlaceholderCompiler> placeholderCompiler;
    private readonly Mock<IFieldPlaceholderReplacer> fieldReplacer1;
    private readonly Mock<IFieldPlaceholderReplacer> fieldReplacer2;
    private readonly IPlaceholderReplacer replacer;
    private readonly Foo foo;

    private interface IFoo { }

    private class Foo : IFoo { }

    [Fact]
    public void ShouldAddJitProcessorsWithPlaceholders()
    {
        var expr1 = Mock.Of<IDslExpression<object>>();
        var expr2 = Mock.Of<IDslExpression<object>>();
        placeholderCompiler.Setup(c => c.FindPlaceholders("Str 1.1")).Returns(new Dictionary<TrimmedRequiredString, IDslExpression<object>>
        {
            { "Plc 1", expr1 },
            { "Plc 2", expr2 },
        });
        placeholderCompiler.Setup(c => c.FindPlaceholders("Str 2")).Returns(new Dictionary<TrimmedRequiredString, IDslExpression<object>>
        {
            { "Plc 2", expr2 },
            { "Plc 3", expr1 },
        });

        RunAndExpectSameContent(); // Act

        var processor = (PlaceholdersJustInTimeProcessor)AddedJitProcessor;
        processor.Replacer.Should().BeSameAs(replacer);
        processor.FieldsToReplace.Should().BeEquivalentTo(new Dictionary<string, IFieldPlaceholderReplacer>
        {
            { "StrField 1", fieldReplacer1.Object },
            { "FooField", fieldReplacer2.Object },
        });
        processor.Placeholders.Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, IDslExpression<object>>
        {
            { "Plc 1", expr1 },
            { "Plc 2", expr2 },
            { "Plc 3", expr1 },
        });

        VerifyGetReplaceableStrings();
        VerifyPlaceholderCompilation();
        log.VerifyNothingLogged();
    }

    [Fact]
    public void ShouldNotAddJitProcessor_IfNoFieldsSupportPlaceholders()
    {
        SetupContentFields(("Incompatible", 123), ("Null", null));

        RunAndExpectSameContent(); // Act

        VerifyNoJitProcessorAdded();
        fieldReplacer1.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Never);
        fieldReplacer2.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Never);
        placeholderCompiler.VerifyWithAnyArgs(c => c.FindPlaceholders(null), Times.Never);
    }

    [Fact]
    public void ShouldNotAddJitProcessor_IfNoPlaceholdersFound()
    {
        RunAndExpectSameContent(); // Act

        VerifyNoJitProcessorAdded();
        VerifyGetReplaceableStrings();
        VerifyPlaceholderCompilation();
    }

    [Fact]
    public void ShouldLogWarnings_FromDslCompilation()
    {
        IReadOnlyDictionary<TrimmedRequiredString, IDslExpression<object>> dictionary = new Dictionary<TrimmedRequiredString, IDslExpression<object>>();
        placeholderCompiler.Setup(c => c.FindPlaceholders("Str 1.1"))
            .Returns(dictionary.WithWarnings("Warn 1.1", "Warn 1.2"));
        placeholderCompiler.Setup(c => c.FindPlaceholders("Str 2"))
            .Returns(dictionary.WithWarnings("Warn 2"));

        RunAndExpectSameContent(); // Act

        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(LogLevel.Warning,
            ("field", "StrField 1"),
            ("id", InputContent.Id),
            ("warnings", $"1) Warn 1.1{Environment.NewLine}2) Warn 1.2"));
        log.Logged[1].Verify(LogLevel.Warning,
            ("field", "FooField"),
            ("id", InputContent.Id),
            ("warnings", "Warn 2"));
    }

    public enum FailedTestCase
    {
        /// <summary>
        /// ReplaceableStrings
        /// </summary>
        ReplaceableStrings,

        /// <summary>
        /// Compilation
        /// </summary>
        Compilation,
    }

    [Theory, EnumData(typeof(FailedTestCase))]
    public void ShouldReturnInvalidContent_IfSomethingFails(FailedTestCase testCase)
    {
        var ex = new Exception("Placeholder error");
        if (testCase == FailedTestCase.ReplaceableStrings)
            fieldReplacer1.SetupWithAnyArgs(r => r.GetReplaceableStrings(null)).Throws(ex);
        else
            placeholderCompiler.SetupWithAnyArgs(r => r.FindPlaceholders(null)).Throws(ex);

        RunAndExpectInvalidContent(ex); // Act
    }

    private void VerifyNoJitProcessorAdded()
    {
        AddedJitProcessor.Should().BeNull();
        log.VerifyNothingLogged();
    }

    private void VerifyGetReplaceableStrings()
    {
        fieldReplacer1.Verify(r => r.GetReplaceableStrings(It.IsIn("Test 1", "Test 2")));
        fieldReplacer1.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Exactly(2));
        fieldReplacer2.Verify(r => r.GetReplaceableStrings(foo));
        fieldReplacer2.VerifyWithAnyArgs(r => r.GetReplaceableStrings(null), Times.Once);
    }

    private void VerifyPlaceholderCompilation()
    {
        placeholderCompiler.Verify(c => c.FindPlaceholders(It.IsIn<RequiredString>("Str 1.1", "Str 1.2", "Str 2")));
        placeholderCompiler.VerifyWithAnyArgs(c => c.FindPlaceholders(null), Times.Exactly(3));
    }
}
