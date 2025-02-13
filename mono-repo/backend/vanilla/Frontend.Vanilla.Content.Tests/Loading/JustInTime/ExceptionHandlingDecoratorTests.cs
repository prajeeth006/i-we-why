using System;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Loading.JustInTime;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.JustInTime;

public class ExceptionHandlingDecoratorTestsWithTracing() : ExceptionHandlingDecoratorTests(true) { }

public class ExceptionHandlingDecoratorTestsWithoutTracing() : ExceptionHandlingDecoratorTests(false) { }

public abstract class ExceptionHandlingDecoratorTests : TraceTestsBase
{
    public ExceptionHandlingDecoratorTests(bool useTrace)
        : base(useTrace)
    {
        inner = new Mock<IContentLoader>();
        target = new ExceptionHandlingDecorator(inner.Object);

        id = TestDocumentId.Get();
        mode = TestExecutionMode.Get();
        options = TestContentLoadOptions.Get();
    }

    private IContentLoader target;
    private Mock<IContentLoader> inner;

    private DocumentId id;
    private ExecutionMode mode;
    private ContentLoadOptions options;

    private Task<Content<IDocument>> Act()
        => target.GetContentAsync(mode, id, options, TraceFunc);

    [Fact]
    public async Task ShouldReturnSameContent_IfNoException()
    {
        var innerResult = TestContent.Get<IDocument>();
        inner.Setup(i => i.GetContentAsync(mode, id, options, TraceFunc)).ReturnsAsync(innerResult);

        var result = await Act();

        result.Should().BeSameAs(innerResult);
        Trace?.Should().BeEmpty();
    }

    [Fact]
    public async Task ShouldReturnInvalid_IfExceptionThrown()
    {
        var ex = new Exception("Oups");
        inner.Setup(i => i.GetContentAsync(mode, id, options, TraceFunc)).Throws(ex);

        var result = await Act();

        result.Should().BeOfType<InvalidContent<IDocument>>()
            .Which.Errors.Should().Equal($"Loading content {id} failed unexpectedly: {ex}");
        Trace?.Single().Should().Be($"Loading failed unexpectedly: {ex}");
    }
}
