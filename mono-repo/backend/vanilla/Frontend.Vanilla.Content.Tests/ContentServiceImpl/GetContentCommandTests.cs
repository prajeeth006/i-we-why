using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.ContentServiceImpl;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Content.Tests.Fakes;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.ContentServiceImpl;

public class GetContentCommandTests
{
    private IGetContentCommand target;
    private Mock<IContentLoader> loader;

    private DocumentId id;
    private ExecutionMode mode;
    private ContentLoadOptions options;
    private Content<IDocument> contentToReturn;

    public GetContentCommandTests()
    {
        loader = new Mock<IContentLoader>();
        target = new GetContentCommand(loader.Object);

        id = TestDocumentId.Get();
        mode = TestExecutionMode.Get();
        options = TestContentLoadOptions.Get();
        contentToReturn = TestContent.Get<IDocument>(document: Mock.Of<IPCText>());
        loader.Setup(l => l.GetContentAsync(mode, id, options, null)).ReturnsAsync(() => contentToReturn);
    }

    private Task<Content<TDocument>> Act<TDocument>()
        where TDocument : class, IDocument
        => target.GetAsync<TDocument>(mode, id, options); // Act

    [Fact]
    public async Task ShouldReturnSameTypedContent_IfDirectIDocumentRequested()
    {
        var content = await Act<IDocument>();

        content.Should().BeSameAs(contentToReturn);
    }

    [Fact]
    public async Task ShouldRecreateTypedContent_IfSuccess()
    {
        var content = await Act<IPCText>();

        content.Should().BeOfType<SuccessContent<IPCText>>()
            .Which.Document.Should().BeSameAs(((SuccessContent<IDocument>)contentToReturn).Document);
    }

    [Fact]
    public async Task ShouldFail_IfSuccess_ButIncompatibleDocumentType()
    {
        var content = await Act<IPCImage>();

        content.Metadata.Should().BeSameAs(contentToReturn.Metadata);
        content.Should().BeOfType<InvalidContent<IPCImage>>()
            .Which.Errors.Should().Equal("Actual document is Castle.Proxies.IPCTextProxy but incompatible Frontend.Vanilla.Content.Model.IPCImage was requested.");
    }

    [Fact]
    public async Task ShouldRecreateTypedContent_IfInvalid()
    {
        contentToReturn = TestContent.Get<IDocument>(DocumentStatus.Invalid);

        var content = await Act<IPCText>();

        content.Metadata.Should().BeSameAs(contentToReturn.Metadata);
        content.Should().BeOfType<InvalidContent<IPCText>>()
            .Which.Errors.Should().Equal(((InvalidContent<IDocument>)contentToReturn).Errors);
    }

    [Fact]
    public async Task ShouldRecreateTypedContent_IfFiltered()
    {
        contentToReturn = TestContent.Get<IDocument>(DocumentStatus.Filtered);

        var content = await Act<IPCText>();

        content.Metadata.Should().BeSameAs(contentToReturn.Metadata);
        content.Should().BeOfType<FilteredContent<IPCText>>();
    }

    [Fact]
    public async Task ShouldRecreateTypedContent_IfNotFound()
    {
        contentToReturn = TestContent.Get<IDocument>(DocumentStatus.NotFound);

        var content = await Act<IPCText>();

        content.Id.Should().Be(contentToReturn.Id);
        content.Should().BeOfType<NotFoundContent<IPCText>>();
    }
}
