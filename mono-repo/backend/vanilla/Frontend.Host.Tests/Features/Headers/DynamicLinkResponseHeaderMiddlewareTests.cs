using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Headers;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.Headers;

public sealed class DynamicLinkResponseHeaderMiddlewareTests
{
    private Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<IHeadersConfiguration> headersConfiguration;
    private TestLogger<DynamicLinkResponseHeaderMiddleware> log;
    private Mock<IBootstrapAssetsContext> bootstrapAssetsContext;

    private DefaultHttpContext ctx;

    public DynamicLinkResponseHeaderMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        headersConfiguration = new Mock<IHeadersConfiguration>();
        ctx = new DefaultHttpContext();
        bootstrapAssetsContext = new Mock<IBootstrapAssetsContext>();
        log = new TestLogger<DynamicLinkResponseHeaderMiddleware>();
        target = new DynamicLinkResponseHeaderMiddleware(next.Object, endpointMetadata.Object, headersConfiguration.Object, bootstrapAssetsContext.Object, log);

        ctx.RequestAborted = TestCancellationToken.Get();
        endpointMetadata.Setup(c => c.Contains<ServesHtmlDocumentAttribute>()).Returns(true);

        bootstrapAssetsContext.Setup(c => c.GetWebpackManifestFileEntriesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(
            new Dictionary<string, string>
            {
                ["main.js"] = "/ClientDist/main.js",
                ["styles.css"] = "/ClientDist/styles.css",
                ["font"] = "/ClientDist/font",
            });
        headersConfiguration.SetupGet(c => c.DynamicEarlyHintsFromManifest).Returns(new Dictionary<string, IDictionary<string, string>>()
        {
            {
                "main.js",
                new Dictionary<string, string>
                {
                    ["rel"] = "preload",
                    ["as"] = "script",
                    ["crossorigin"] = "anonymous",
                }
            },
            {
                "polyfills.js",
                new Dictionary<string, string>
                {
                    ["rel"] = "preload",
                    ["as"] = "script",
                    ["crossorigin"] = "anonymous",
                }
            },
            {
                "styles.css",
                new Dictionary<string, string>
                {
                    ["rel"] = "preload",
                    ["as"] = "styles",
                    ["crossorigin"] = "anonymous",
                }
            },
            {
                "font",
                new Dictionary<string, string>
                {
                    ["rel"] = "preconnect",
                    ["crossorigin"] = "anonymous",
                }
            },
        });
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldNotExecute_IfConfigIsEmpty()
    {
        headersConfiguration.SetupGet(c => c.DynamicEarlyHintsFromManifest).Returns(new Dictionary<string, IDictionary<string, string>>());
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldNotExecute_IfManifestIsEmpty()
    {
        bootstrapAssetsContext.Setup(c => c.GetWebpackManifestFileEntriesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(new Dictionary<string, string>());
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldNotAddLinkHeader_IfFilesAreNotInManifest()
    {
        bootstrapAssetsContext.Setup(c => c.GetWebpackManifestFileEntriesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(
            new Dictionary<string, string>
            {
                ["main1.js"] = "/ClientDist/main.js",
                ["styles1.css"] = "/ClientDist/styles.css",
            });
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldAddLinkHeader_IfDocumentRequest()
    {
        await Act();

        var res = ctx.Response;
        res.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
        {
            {
                "Link",
                "</ClientDist/main.js>; rel=preload; as=script; crossorigin=anonymous, </ClientDist/styles.css>; rel=preload; as=styles; crossorigin=anonymous, </ClientDist/font>; rel=preconnect; crossorigin=anonymous"
            },
        });
    }

    [Fact]
    public async Task ShouldUpdateLinkHeaderValue_IfLinkAlreadyExist()
    {
        ctx.Response.Headers.Append("Link", "<test>; rel=preconnect");
        await Act();

        var res = ctx.Response;
        res.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
        {
            {
                "Link",
                "<test>; rel=preconnect, </ClientDist/main.js>; rel=preload; as=script; crossorigin=anonymous, </ClientDist/styles.css>; rel=preload; as=styles; crossorigin=anonymous, </ClientDist/font>; rel=preconnect; crossorigin=anonymous"
            },
        });
    }

    [Fact]
    public async Task ShouldLogError()
    {
        var exception = new Exception();
        bootstrapAssetsContext.Setup(c => c.GetWebpackManifestFileEntriesAsync(It.IsAny<CancellationToken>())).ThrowsAsync(exception);

        await Act();

        var res = ctx.Response;
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }
}
