using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Client;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.ContentEndpoint;
using Frontend.Vanilla.Features.PublicPages;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ContentEndpoint;

public class ContentEndpointServiceTests
{
    private readonly ContentEndpointService service;
    private readonly Mock<IAuthorizationConfiguration> authConfig;
    private readonly Mock<IVanillaClientContentService> clientContentService;
    private readonly Mock<IRequestedContentValidator> requestedContentValidator;
    private readonly Mock<IContentService> contentService;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly IOptions<ContentEndpointOptions> options;
    private readonly PublicPagesConfiguration publicPagesConfiguration;
    private readonly TestLogger<ContentEndpointService> log;

    private readonly ClientDocument item;
    private readonly CancellationToken ct;

    private readonly Content<IDocument> contentResult;
    private readonly Mock<IDocument> document;
    private readonly Mock<IDocumentMetadata> metadata;

    public ContentEndpointServiceTests()
    {
        authConfig = new Mock<IAuthorizationConfiguration>();
        clientContentService = new Mock<IVanillaClientContentService>();
        requestedContentValidator = new Mock<IRequestedContentValidator>();
        contentService = new Mock<IContentService>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        publicPagesConfiguration = new PublicPagesConfiguration
        {
            PrefetchDepth = 9,
        };
        options = Options.Create(new ContentEndpointOptions());
        log = new TestLogger<ContentEndpointService>();
        service = new ContentEndpointService(
            options,
            publicPagesConfiguration,
            authConfig.Object,
            currentUserAccessor.Object,
            contentService.Object,
            requestedContentValidator.Object,
            log);

        ct = TestCancellationToken.Get();
        item = Mock.Of<ClientDocument>();

        document = new Mock<IDocument>();
        metadata = new Mock<IDocumentMetadata>();
        metadata.SetupGet(m => m.Id).Returns("test");

        document.SetupGet(d => d.Metadata).Returns(metadata.Object);

        contentResult = new SuccessContent<IDocument>(document.Object);

        contentService.Setup(c => c.GetContentAsync<IDocument>("test", ct, It.Is<ContentLoadOptions>(o => o.PrefetchDepth == 9)))
            .ReturnsAsync(() => contentResult);

        clientContentService.Setup(c => c.ConvertAsync(document.Object, ct, It.IsAny<ContentLoadOptions>())).ReturnsAsync(item);

        options.Value.AllowedPaths.Add(new Regex("test.*"));
        options.Value.DisallowedPaths.Add(new Regex("test/secret"));
        options.Value.AllowedAnonymousAccessRestrictedPaths.Add(new Regex("test/allowed"));
        options.Value.ClientContentService = clientContentService.Object;
        requestedContentValidator.Setup(r => r.Validate(contentResult)).Returns(new OkRequestedContentValidationResult(document.Object));
    }

    [Fact]
    public async Task ShouldReturnContent()
    {
        contentService.Setup(c => c.GetContent<IDocument>("test", It.Is<ContentLoadOptions>(o => o.PrefetchDepth == 9 && o.DslEvaluation == DslEvaluation.FullOnServer)))
            .Returns(() => contentResult);
        clientContentService.Setup(c =>
                c.ConvertAsync(document.Object, ct, It.Is<ContentLoadOptions>(o => o.PrefetchDepth == 9 && o.DslEvaluation == DslEvaluation.FullOnServer)))
            .ReturnsAsync(item);

        var result = await service.FetchContent("test", false, ct); // Act

        result.Should().BeOfType<OkContentEndpointResult>().Which.Document.Should().BeSameAs(item);
    }

    [Fact]
    public async Task ShouldFilterContentOnClientIfSpecified()
    {
        contentService.Setup(c =>
                c.GetContent<IDocument>("test", It.Is<ContentLoadOptions>(o => o.PrefetchDepth == 9 && o.DslEvaluation == DslEvaluation.PartialForClient)))
            .Returns(() => contentResult);
        clientContentService.Setup(c =>
                c.ConvertAsync(document.Object, ct, It.Is<ContentLoadOptions>(o => o.PrefetchDepth == 9 && o.DslEvaluation == DslEvaluation.PartialForClient)))
            .ReturnsAsync(item);

        var result = await service.FetchContent("test", true, ct); // Act

        result.Should().BeOfType<OkContentEndpointResult>().Which.Document.Should().BeSameAs(item);
    }

    [Fact]
    public async Task ShouldReturnNotFoundIfPathIsNotAllowed()
    {
        var result = await service.FetchContent("test/secret", false, ct); // Act

        result.Should().BeOfType<NotAllowedContentEndpointResult>();

        log.Logged.Single().Verify(LogLevel.Warning, ("path", "test/secret"));
    }

    [Fact]
    public async Task ShouldReturnNotFoundIfContentIsNotFoundAndLogWarning()
    {
        requestedContentValidator.Setup(r => r.Validate(contentResult)).Returns(new NotFoundRequestedContentValidationResult());
        metadata.SetupGet(m => m.Version).Returns(99);

        var result = await service.FetchContent("test", false, ct); // Act

        result.Should().BeOfType<NotFoundContentEndpointResult>();
        log.Logged.Single().Verify(LogLevel.Warning, ("docId", (DocumentId)"/test"), ("status", "Success"), ("version", 99));
    }

    [Fact]
    public async Task ShouldThrowErrorIfContentIsInvalid()
    {
        var errors = new List<TrimmedRequiredString> { "err1", "err2" };
        requestedContentValidator.Setup(r => r.Validate(contentResult)).Returns(new ErrorRequestedContentValidationResult(errors));

        var exception = await Assert.ThrowsAsync<Exception>(async () => await service.FetchContent("test", false, ct));

        exception.Message.Should().Contain($"1) err1{Environment.NewLine}2) err2");
    }

    [Fact]
    public async Task ShouldReturnContentForAllowedRestrictedPathsIfAuthenticatedUsersAndAnonymousIsRestricted()
    {
        currentUserAccessor.Setup(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity("Authenticated")));
        authConfig.SetupGet(c => c.IsAnonymousAccessRestricted).Returns(true);

        var result = await service.FetchContent("test", false, ct); // Act

        result.Should().BeOfType<OkContentEndpointResult>();
    }

    [Fact]
    public async Task ShouldReturnContentForIfUnauthenticatedUsersAndAnonymousIsRestrictedWhen()
    {
        contentService.Setup(c => c.GetContentAsync<IDocument>("test/allowed", ct, It.Is<ContentLoadOptions>(o => o.PrefetchDepth == 9)))
            .ReturnsAsync(() => contentResult);
        currentUserAccessor.Setup(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity()));
        authConfig.SetupGet(c => c.IsAnonymousAccessRestricted).Returns(true);

        var result = await service.FetchContent("test/allowed", false, ct); // Act

        result.Should().BeOfType<OkContentEndpointResult>();
    }

    [Fact]
    public async Task ShouldReturnUnAuthorizedForUnauthenticatedUsersIfAnonymousIsRestricted()
    {
        currentUserAccessor.Setup(a => a.User).Returns(new ClaimsPrincipal(new ClaimsIdentity()));
        authConfig.SetupGet(c => c.IsAnonymousAccessRestricted).Returns(true);

        var result = await service.FetchContent("test", false, ct); // Act

        result.Should().BeOfType<UnauthorizedContentEndpointResult>();
    }
}
