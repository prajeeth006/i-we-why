using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderMiddlewareTests
{
    private Features.WebAbstractions.Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<IPrerenderService> service;
    private PrerenderConfiguration prerenderConfig;
    private Mock<IPrerenderDetector> prerenderDetector;
    private TestLogger<PrerenderMiddleware> log;

    private DefaultHttpContext ctx;
    private const string XForwardedFor = "10.10.1.1";
    private const string XCorrelationId = "b9b942ac-e193-4b52-8718-ffb1b03c7027";

    public PrerenderMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        service = new Mock<IPrerenderService>();
        prerenderConfig = new PrerenderConfiguration();
        prerenderDetector = new Mock<IPrerenderDetector>();
        log = new TestLogger<PrerenderMiddleware>();
        target = new PrerenderMiddleware(next.Object, endpointMetadata.Object, service.Object, prerenderConfig, prerenderDetector.Object, log);

        ctx = new DefaultHttpContext();

        prerenderConfig.Enabled = true;
        prerenderConfig.ExcludedPagePathAndQueryRegex = new Regex("excluded-page$");
        prerenderConfig.CacheControlResponseHeader = "no-cache";

        ctx.Request.Headers[HttpHeaders.UserAgent] = "GoogleBot";
        ctx.RequestAborted = TestContext.Current.CancellationToken;
        ctx.Request.Headers[HttpHeaders.XForwardedFor] = XForwardedFor;
        ctx.Request.Headers[HttpHeaders.XCorrelationId] = XCorrelationId;
        ctx.Request.Scheme = "http";
        ctx.Request.Host = new HostString("www.bwin.com");
        ctx.Request.Path = "/en/page";
        ctx.Response.Body = new MemoryStream();

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        service.SetupWithAnyArgs(s => s.GetPrerenderedPageAsync(null, null, XForwardedFor, XCorrelationId, default))
            .ReturnsAsync(new RestResponse(new RestRequest(new HttpUri("http://actual/prerender/url")))
            {
                StatusCode = HttpStatusCode.Accepted,
                Content = "<prerendered />".EncodeToBytes(),
                Headers =
                {
                    { "X-Test-1", "TestValue1" },
                    { "X-Test-2", new[] { "TestValue2.1", "TestValue2.2" } },
                },
            });
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldSetHttpResponseFromPrerenderService()
        => await RunSuccessTest();

    private async Task RunSuccessTest(string expectedUserAgent = "GoogleBot")
    {
        await Act();

        var res = ctx.Response;
        res.StatusCode.Should().Be((int)HttpStatusCode.Accepted);
        res.GetBodyString().Should().Be("<prerendered />");

        res.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
        {
            { "X-Test-1", "TestValue1" },
            { "X-Test-2", new[] { "TestValue2.1", "TestValue2.2" } },
            { PrerenderMiddleware.DiagnosticHeader, "http://actual/prerender/url" },
            { HttpHeaders.CacheControl, "no-cache" },
        });

        service.Verify(s => s.GetPrerenderedPageAsync(new HttpUri("http://www.bwin.com/en/page"), expectedUserAgent, XForwardedFor, XCorrelationId, ctx.RequestAborted));
        next.VerifyNoOtherCalls();
        log.VerifyNothingLogged();
    }

    [Theory]
    [InlineData("Bot from google")]
    [InlineData("FaceBookF***er")]
    public async Task ShouldMatchCrawlerIgnoringCase(string userAgent)
    {
        ctx.Request.Headers[HttpHeaders.UserAgent] = userAgent;
        await RunSuccessTest(userAgent);
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoExecutionTest();
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfUrlContainsSkipPrerender()
    {
        ctx.Request.Query = new QueryCollection(new Dictionary<string, StringValues>
        {
            { PrerenderMiddleware.QueryKeyDisableToggle, "1" },
        });

        await RunNoExecutionTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfDisabledInConfig()
    {
        prerenderConfig.Enabled = false;
        await RunNoExecutionTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfRequestFromPrerender()
    {
        prerenderDetector.SetupGet(p => p.IsRequestFromPrerenderService).Returns(true);
        await RunNoExecutionTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfExcludedPage()
    {
        ctx.Request.Path = "/en/excluded-page";
        await RunNoExecutionTest();
    }

    [Fact]
    public async Task ShouldNotExecute_IfExcludedPageWithQueryString()
    {
        ctx.Request.Path = "/en/excluded-page";
        ctx.Request.QueryString = new QueryString("?query=1");
        await RunNoExecutionTest();
    }

    private async Task RunNoExecutionTest()
    {
        await Act();

        next.Verify(n => n(ctx));
        service.VerifyNoOtherCalls();
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldHandleServiceExceptions()
    {
        var serviceEx = new Exception("Service error");
        service.SetupWithAnyArgs(s => s.GetPrerenderedPageAsync(null, null, XForwardedFor, XCorrelationId, TestContext.Current.CancellationToken)).ThrowsAsync(serviceEx);

        await Act();

        log.Logged.Single().Verify(LogLevel.Error, serviceEx, ("correlationId", XCorrelationId));
        ctx.Response.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
            { { PrerenderMiddleware.DiagnosticHeader, "FAILED" }, { HttpHeaders.XCorrelationId, XCorrelationId } });
        next.Verify(n => n(ctx));
    }
}
