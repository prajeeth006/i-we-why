using FluentAssertions;
using Frontend.Host.Features.PageNotFound;
using Frontend.Host.Features.SiteRootFiles;
using Frontend.Vanilla.Core.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.PageNotFound;

public class PageNotFoundControllerTests
{
    private readonly Mock<ISiteRootFileResolver> siteRootFileResolver;
    private readonly CancellationToken ct;
    private readonly PageNotFoundController controller;
    private readonly DefaultHttpContext context;

    public PageNotFoundControllerTests()
    {
        siteRootFileResolver = new Mock<ISiteRootFileResolver>();
        ct = new CancellationTokenSource().Token;

        context = new DefaultHttpContext
        {
            Request =
            {
                Path = new PathString("/test/page?q=1"),
                Scheme = HttpScheme.Https.ToString(),
                Host = new HostString("www.bwin.com"),
            },
            RequestAborted = ct,
            Response =
            {
                StatusCode = StatusCodes.Status200OK,
            },
        };

        controller = new PageNotFoundController(siteRootFileResolver.Object);
        controller.ControllerContext = new ControllerContext();
        controller.ControllerContext.HttpContext = context;
    }

    [Fact]
    public async Task ShouldReturnView()
    {
        var httpActionResult = await controller.NotFoundAsync(ct);
        var result = httpActionResult as ViewResult;

        result?.ViewName.Should().Be("Index");
        context.Response.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }

    [Fact]
    public async Task ShouldTransmitSiteRootFile()
    {
        context.Request.Path = "/test/page";
        var fileResult = new SiteRootFileResult(ContentTypes.Text, TimeSpan.Zero, "Hello");
        siteRootFileResolver.Setup(r => r.ResolveAsync("/test/page", ct)).ReturnsAsync(fileResult);

        var result = await controller.NotFoundAsync(ct);

        result.Should().BeEquivalentTo(new SiteRootAspNetCoreFileResult(fileResult));
    }
}
