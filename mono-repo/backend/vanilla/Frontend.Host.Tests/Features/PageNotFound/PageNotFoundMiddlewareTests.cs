using FluentAssertions;
using Frontend.Host.Features.PageNotFound;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.PublicPages;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.PageNotFound;

public sealed class PageNotFoundMiddlewareTests
{
    private readonly Middleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<IRequestedContentValidator> requestedContentValidator;
    private readonly Mock<IPublicPagesConfiguration> publicPagesConfiguration;
    private readonly Mock<IPageNotFoundConfiguration> pageNotFoundConfiguration;
    private readonly TestLogger<PageNotFoundMiddleware> log;

    private readonly Mock<IDocument> document;
    private readonly Content<IDocument> content;
    private readonly Mock<IDocumentMetadata> metadata;

    private readonly DefaultHttpContext ctx;

    public PageNotFoundMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        publicPagesConfiguration = new Mock<IPublicPagesConfiguration>();
        pageNotFoundConfiguration = new Mock<IPageNotFoundConfiguration>();
        requestedContentValidator = new Mock<IRequestedContentValidator>();
        contentService = new Mock<IContentService>();

        ctx = new DefaultHttpContext();
        log = new TestLogger<PageNotFoundMiddleware>();

        document = new Mock<IDocument>();
        metadata = new Mock<IDocumentMetadata>();
        metadata.SetupGet(m => m.Id).Returns("root/id");

        document.SetupGet(d => d.Metadata).Returns(metadata.Object);

        content = new SuccessContent<IDocument>(document.Object);

        contentService.Setup(c => c.GetContent<IDocument>("root/id", It.IsAny<ContentLoadOptions>()))
            .Returns(() => content);

        ctx.Request.RouteValues.Add(RouteValueKeys.Path, "id");
        pageNotFoundConfiguration.SetupGet(x => x.ClientPaths)
            .Returns(new Dictionary<string, IReadOnlyList<string>> { { "vanilla", new[] { "/test", "/labelhost/*" } } });

        target = new PageNotFoundMiddleware(
            next.Object,
            endpointMetadata.Object,
            contentService.Object,
            requestedContentValidator.Object,
            publicPagesConfiguration.Object,
            pageNotFoundConfiguration.Object,
            log);
    }

    [Fact]
    public async Task ShouldNotExecute_IfServesNotFoundAttribute()
    {
        endpointMetadata.Setup(m => m.Contains<ServesNotFoundAttribute>()).Returns(true);
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldNotExecute_IfNoPath()
    {
        ctx.Request.RouteValues[RouteValueKeys.Path] = null;
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldReturn404_WhenNotMatchingConfig()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);

        ctx.Request.Path = "/randomPath";
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.StatusCode.Should().Be(404);
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldNotChangeStatusCode_WhenMatchingConfig()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);

        ctx.Request.Path = "/labelhost/test";
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldReturn404_WhenNotFoundContent()
    {
        endpointMetadata.Setup(m => m.Contains<ServesPublicPagesAttribute>()).Returns(true);
        endpointMetadata.Setup(x => x.Get<ServesPublicPagesAttribute>()).Returns(new ServesPublicPagesAttribute("root/"));
        requestedContentValidator.Setup(r => r.Validate(content)).Returns(new NotFoundRequestedContentValidationResult());
        metadata.SetupGet(m => m.Version).Returns(99);

        await target.InvokeAsync(ctx);

        log.Logged[0].Verify(LogLevel.Warning, ("id", (DocumentId)"root/id"), ("status", "Success"), ("version", 99));

        next.Verify(n => n(ctx));
        ctx.Response.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task ShouldReturnBadRequest_WhenInvalidContent()
    {
        endpointMetadata.Setup(m => m.Contains<ServesPublicPagesAttribute>()).Returns(true);
        endpointMetadata.Setup(x => x.Get<ServesPublicPagesAttribute>()).Returns(new ServesPublicPagesAttribute("root/"));

        var errors = new List<TrimmedRequiredString> { "err1", "err2" };
        requestedContentValidator.Setup(r => r.Validate(content)).Returns(new ErrorRequestedContentValidationResult(errors));

        await target.InvokeAsync(ctx);

        log.Logged[0].Verify(LogLevel.Error);

        next.Verify(n => n(ctx));
        ctx.Response.StatusCode.Should().Be(400);
    }

    [Fact]
    public async Task ShouldNotChangeStatusCode_WhenValidContent()
    {
        endpointMetadata.Setup(m => m.Contains<ServesPublicPagesAttribute>()).Returns(true);
        endpointMetadata.Setup(x => x.Get<ServesPublicPagesAttribute>()).Returns(new ServesPublicPagesAttribute("root/"));
        requestedContentValidator.Setup(r => r.Validate(content)).Returns(new OkRequestedContentValidationResult(document.Object));

        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }
}
