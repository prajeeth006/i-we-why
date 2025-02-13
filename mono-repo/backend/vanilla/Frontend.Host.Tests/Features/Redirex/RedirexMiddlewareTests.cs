using FluentAssertions;
using Frontend.Host.Features.Redirex;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.Redirex;

public class RedirexMiddlewareTests
{
    private Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<IRedirexService> service;
    private RedirexConfiguration config;
    private TestLogger<RedirexMiddleware> log;

    private DefaultHttpContext ctx;
    private RedirexResponse redirexResponse;

    public RedirexMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        service = new Mock<IRedirexService>();
        config = new RedirexConfiguration
        {
            Enabled = true,
            SslOffloadingMode = true,
            IgnoreGlobalHttpsRedirect = true,
            ForceUsageOfDisabledRepository = true,
        };
        log = new TestLogger<RedirexMiddleware>();
        target = new RedirexMiddleware(next.Object, endpointMetadata.Object, service.Object, config, log);

        ctx = new DefaultHttpContext();
        redirexResponse = new RedirexResponse
        {
            IsRedirect = true,
            IsTemporary = true,
            Url = "https://www.bwin.com/redirex",
            HttpHeaders = new List<KeyValuePair<string, string[]>>
            {
                new ("X-Redirect-Source", new[] { "Redirex" }),
            },
        };

        config.Enabled = true;

        ctx.Request.Headers[HttpHeaders.XForwardedFor] = "IPAddress.Loopback, SomethingElse";
        ctx.Request.Headers[HttpHeaders.UserAgent] = "GoogleBot";
        ctx.Request.Scheme = "http";
        ctx.Request.Host = new HostString("www.bwin.com");
        ctx.Request.Path = "/en/page";
        ctx.Response.Body = new MemoryStream();

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        service.SetupWithAnyArgs(s => s.PostAsync(It.IsAny<RedirexRequestData>(), default))
            .ReturnsAsync(redirexResponse);
        service.Setup(s => s.ShouldSkip(ctx)).Returns(false);
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldSetHttpResponseFromRedirex()
        => await RunSuccessTest();

    private async Task RunSuccessTest()
    {
        await Act();

        service.Verify(s =>
            s.PostAsync(
                It.Is<RedirexRequestData>(r =>
                    r.IPAddress == "IPAddress.Loopback" && r.UserAgent == "GoogleBot" && r.Url == "http://www.bwin.com/en/page" && r.IgnoreGlobalHttpsRedirect == true &&
                    r.ForceUsageOfDisabledRepository == true && r.SSLOffloadingMode == true), ctx.RequestAborted));
        ctx.Response.Headers.GetValue("X-Redirect-Source").ToString().Should().Be("Redirex");
        ctx.Response.Headers.GetValue("Location").ToString().Should().Be("https://www.bwin.com/redirex");
        ctx.Response.StatusCode.Should().Be(StatusCodes.Status302Found);
        next.VerifyNoOtherCalls();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await RunNoExecutionTest(0);
    }

    [Fact]
    public async Task ShouldNotExecute_IfDisabledInConfig()
    {
        config.Enabled = false;
        await RunNoExecutionTest(0);
    }

    [Fact]
    public async Task ShouldNotExecute_IfSkipped()
    {
        service.Setup(s => s.ShouldSkip(ctx)).Returns(true);
        await RunNoExecutionTest(1);
    }

    private async Task RunNoExecutionTest(int shouldSkipCount)
    {
        await Act();

        next.Verify(n => n(ctx));
        service.Verify(s => s.ShouldSkip(ctx), Times.Exactly(shouldSkipCount));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }
}
