using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Moq;

namespace Frontend.Vanilla.Content.Tests.Loading;

public abstract class PreCachingContentProcessorTestsBase : TraceTestsBase
{
    protected PreCachingContentProcessorTestsBase(bool useTrace)
        : base(useTrace)
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
        Metadata = new Mock<IDocumentMetadata>();
        PreviousJitProcessor = Mock.Of<IJustInTimeContentProcessor>();
        JitProcessors = new List<IJustInTimeContentProcessor> { PreviousJitProcessor };
        Metadata.SetupGet(m => m.Id).Returns(new DocumentId("/test", culture: new CultureInfo("sw-KE")));

        SetupContentFields(("Foo", "Bar"));
    }

    internal SyncPreCachingContentProcessor Target { get; set; }
    protected SuccessContent<IDocument> InputContent { get; set; }
    protected IJustInTimeContentProcessor PreviousJitProcessor { get; set; }
    protected List<IJustInTimeContentProcessor> JitProcessors { get; set; }
    protected Mock<IDocumentMetadata> Metadata { get; set; }

    protected void SetupContentFields(params (string, object)[] fields)
        => SetupContentFields(typeof(TestDocument), fields);

    protected void SetupContentFields(Type documentType, params (string, object)[] fields)
        => InputContent = new SuccessContent<IDocument>((IDocument)Activator.CreateInstance(documentType, new DocumentData(Metadata.Object, fields.ToDictionary())));

    protected Content<IDocument> Target_Process()
        => Target.Process(InputContent, JitProcessors, TraceFunc);

    protected void RunAndExpectSameContent()
    {
        var result = Target_Process(); // Act

        result.VerifySuccess(InputContent.Id);
        result.Should().BeSameAs(InputContent);
    }

    protected void RunAndExpectInvalidContent(Exception expectedException)
        => RunAndExpectInvalidContent(expectedException.ToString());

    protected void RunAndExpectInvalidContent(params string[] expectedErrorSubstrs)
    {
        var result = Target_Process(); // Act

        result.Metadata.Should().BeSameAs(InputContent.Metadata);
        result.Should().BeOfType<InvalidContent<IDocument>>()
            .Which.Errors.Single().Value.Should().ContainAll(expectedErrorSubstrs);
    }

    protected IJustInTimeContentProcessor AddedJitProcessor
    {
        get
        {
            JitProcessors.Count.Should().BeGreaterOrEqualTo(1).And.BeLessOrEqualTo(2);
            JitProcessors[0].Should().BeSameAs(PreviousJitProcessor);

            return JitProcessors.ElementAtOrDefault(1);
        }
    }
}
