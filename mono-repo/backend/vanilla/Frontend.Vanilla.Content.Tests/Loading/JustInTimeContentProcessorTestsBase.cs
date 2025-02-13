using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;

namespace Frontend.Vanilla.Content.Tests.Loading;

public abstract class JustInTimeContentProcessorTestsBase : TraceTestsBase
{
    protected JustInTimeContentProcessorTestsBase(bool useTrace)
        : base(useTrace)
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
        Mode = TestExecutionMode.Get();
        Options = TestContentLoadOptions.Get();
        Loader = new Mock<IContentLoader>();

        SetupContentFields(("Foo", "Bar"));
    }

    protected IJustInTimeContentProcessor Target { get; set; }
    protected ExecutionMode Mode { get; set; }
    protected SuccessContent<IDocument> InputContent { get; set; }
    protected ContentLoadOptions Options { get; set; }
    protected Mock<IContentLoader> Loader { get; private set; }

    protected void SetupContentFields(params (string, object)[] fields)
        => InputContent =
            new SuccessContent<IDocument>(new TestDocument(new DocumentData(Mock.Of<IDocumentMetadata>(m => m.Id == (DocumentId)"/test-id"), fields.ToDictionary())));

    protected Task<Content<IDocument>> Target_ProcessAsync()
        => Target.ProcessAsync(Mode, InputContent, Options, Loader.Object, TraceFunc);

    protected async Task RunAndExpectSameContentAsync()
    {
        var result = await Target_ProcessAsync(); // Act

        result.VerifySuccess(InputContent.Id);
        result.Should().BeSameAs(InputContent);
    }

    protected Task RunAndExpectInvalidContentAsync(Exception expectedException)
        => RunAndExpectInvalidContentAsync(expectedException.ToString());

    protected async Task RunAndExpectInvalidContentAsync(string expectedErrorSubstr)
    {
        var result = await Target_ProcessAsync(); // Act

        result.Metadata.Should().BeSameAs(InputContent.Metadata);
        result.Should().BeOfType<InvalidContent<IDocument>>()
            .Which.Errors.Single().Value.Should().Contain(expectedErrorSubstr);
    }
}
