using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.EntryWeb.Headers;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Headers;

public sealed class ResponseHeadersMiddlewareTests
{
    private readonly Features.WebAbstractions.Middleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<IHeadersConfiguration> headersConfiguration;
    private readonly TestLogger<ResponseHeadersMiddleware> log;

    private readonly DefaultHttpContext ctx;

    public ResponseHeadersMiddlewareTests()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        headersConfiguration = new Mock<IHeadersConfiguration>();
        ctx = new DefaultHttpContext();
        log = new TestLogger<ResponseHeadersMiddleware>();
        target = new ResponseHeadersMiddleware(next.Object, endpointMetadata.Object, headersConfiguration.Object, log);

        ctx.RequestAborted = TestCancellationToken.Get();
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        var dslExpressionTrue = new Mock<IDslExpression<bool>>();
        var dslExpressionFalse = new Mock<IDslExpression<bool>>();
        dslExpressionTrue.Setup(e => e.EvaluateAsync(It.IsAny<CancellationToken>())).ReturnsAsync(true);
        dslExpressionFalse.Setup(e => e.EvaluateAsync(It.IsAny<CancellationToken>())).ReturnsAsync(false);

        headersConfiguration.SetupGet(c => c.Response).Returns(new Dictionary<string, HeaderConfig>()
        {
            {
                "Header1",
                new HeaderConfig(true, "document request true, enabled true", dslExpressionTrue.Object)
            },
            {
                "Header2",
                new HeaderConfig(true, "document request true, enabled false", dslExpressionFalse.Object)
            },
            {
                "Header3",
                new HeaderConfig(false, "document request false, enabled true", dslExpressionTrue.Object)
            },
            {
                "Header4",
                new HeaderConfig(false, "document request false, enabled false", dslExpressionFalse.Object)
            },
        });
    }

    private Task Act() => target.InvokeAsync(ctx);

    [Fact]
    public async Task ShouldNotExecute_IfConfigIsEmpty()
    {
        headersConfiguration.SetupGet(c => c.Response).Returns(new Dictionary<string, HeaderConfig>());
        await Act();

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
        log.VerifyNothingLogged();
    }

    [Fact]
    public async Task ShouldAddAndUpdateHeaders_IfDocumentRequest()
    {
        ctx.Response.Headers.Append("Header1", "old value");
        await Act();

        var res = ctx.Response;
        res.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
        {
            { "Header1", "document request true, enabled true" },
            { "Header3", "document request false, enabled true" },
        });
    }

    [Fact]
    public async Task ShouldAddHeaders_IfNotDocumentRequest()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);
        await Act();

        var res = ctx.Response;
        res.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues> { { "Header3", "document request false, enabled true" } });
    }

    [Fact]
    public async Task ShouldAddHeaders_AndLogErrors()
    {
        var exception = new Exception();
        var dslExpressionTrue = new Mock<IDslExpression<bool>>();
        var dslExpressionException = new Mock<IDslExpression<bool>>();
        dslExpressionTrue.Setup(e => e.EvaluateAsync(It.IsAny<CancellationToken>())).ReturnsAsync(true);
        dslExpressionException.Setup(e => e.EvaluateAsync(It.IsAny<CancellationToken>())).ThrowsAsync(exception);

        headersConfiguration.SetupGet(c => c.Response).Returns(new Dictionary<string, HeaderConfig>()
        {
            {
                "Header1",
                new HeaderConfig(true, "document request true, enabled true", dslExpressionTrue.Object)
            },
            {
                "Header2",
                new HeaderConfig(true, "document request true, incorrect DSL", dslExpressionException.Object)
            },
        });
        await Act();

        var res = ctx.Response;
        res.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues> { { "Header1", "document request true, enabled true" } });
        log.Logged.Single().Verify(LogLevel.Error,
            exception,
            ("name", "Header2"),
            ("value", "document request true, incorrect DSL"),
            ("dsl", dslExpressionException.Object));
    }
}
