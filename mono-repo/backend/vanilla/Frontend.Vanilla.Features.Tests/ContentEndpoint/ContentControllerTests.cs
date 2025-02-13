using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Content.Client.Infrastructure;
using Frontend.Vanilla.Features.ContentEndpoint;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ContentEndpoint;

public class ContentControllerTests
{
    private readonly ContentController controller;
    private readonly Mock<IContentEndpointService> contentEndpointService;
    private readonly TestLogger<ContentController> log;

    private readonly ClientDocument item;
    private readonly CancellationToken ct;

    public ContentControllerTests()
    {
        contentEndpointService = new Mock<IContentEndpointService>();
        log = new TestLogger<ContentController>();
        controller = new ContentController(contentEndpointService.Object, log);

        ct = TestCancellationToken.Get();
        item = Mock.Of<ClientDocument>();
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task ShouldReturnContent(bool filterOnClient)
    {
        contentEndpointService.Setup(e => e.FetchContent("test", filterOnClient, ct)).ReturnsAsync(new OkContentEndpointResult(item));

        var result = (OkObjectResult)await controller.Get("test", ct, filterOnClient); // Act
        result.Value.Should().BeSameAs(item);
    }

    [Fact]
    public async Task ShouldReturnNotFoundIfPathIsNotAllowed()
    {
        contentEndpointService.Setup(e => e.FetchContent("test", false, ct)).ReturnsAsync(new NotAllowedContentEndpointResult());
        var result = (ObjectResult)await controller.Get("test", ct); // Act

        result.StatusCode.Should().Be(404);
        result.Value.Should().BeEquivalentTo(new { error = "Requested content path is not allowed." });
    }

    [Fact]
    public async Task ShouldReturnErrorIfServiceThrowsAndLogIt()
    {
        var exception = new Exception();
        contentEndpointService.Setup(s => s.FetchContent("test", false, ct)).ThrowsAsync(exception);

        var result = (ObjectResult)await controller.Get("test", ct); // Act

        result.Should().NotBeNull();
        log.Logged.Single().Verify(LogLevel.Error, exception, ("path", "test"), ("filter", false));
    }

    [Fact]
    public async Task ShouldReturnNotFoundIfContentIsNotFoundAndLogWarning()
    {
        contentEndpointService.Setup(r => r.FetchContent("test", false, ct)).ReturnsAsync(new NotFoundContentEndpointResult());

        var result = await controller.Get("test", ct); // Act

        result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task ShouldReturnContentForAuthenticatedUsersIfAnonymousIsRestricted()
    {
        contentEndpointService.Setup(r => r.FetchContent("test", false, ct)).ReturnsAsync(new UnauthorizedContentEndpointResult());

        var result = await controller.Get("test", ct); // Act

        result.Should().BeOfType<UnauthorizedResult>();
    }
}
