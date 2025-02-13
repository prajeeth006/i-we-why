using FluentAssertions;
using Frontend.Host.Features.SuspiciousRequest;
using Frontend.Vanilla.Features.SuspiciousRequest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.SuspiciousRequest;

public class SuspiciousRequestMiddlewareTest
{
    private Middleware target;
    private Mock<RequestDelegate> next;
    private Mock<IEndpointMetadata> endpointMetadata;
    private Mock<ISuspiciousRequestConfiguration> suspiciousRequestConfiguration;
    private DefaultHttpContext httpContext;

    public SuspiciousRequestMiddlewareTest()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        suspiciousRequestConfiguration = new Mock<ISuspiciousRequestConfiguration>();
        target = new SuspiciousRequestMiddleware(next.Object, endpointMetadata.Object, suspiciousRequestConfiguration.Object);

        httpContext = new DefaultHttpContext();
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        httpContext.Request.Query = new QueryCollection(new Dictionary<string, StringValues> { ["test"] = "1", ["regex"] = "se3" });
        suspiciousRequestConfiguration.SetupGet(m => m.QueryStringRules).Returns(new Dictionary<string, StringRule>());
    }

    private Task Act() => target.InvokeAsync(httpContext);

    [Fact]
    public async Task ShouldNotDoAnything_IfNotServingHtml()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(false);

        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNoQuery()
    {
        httpContext.Request.Query = new QueryCollection();

        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldNotDoAnything_ConfigurationIsEmpty()
    {
        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldNotDoAnything_IfNoRuleIsMeet()
    {
        suspiciousRequestConfiguration.SetupGet(m => m.QueryStringRules).Returns(new Dictionary<string, StringRule>()
        {
            { "test", new StringRule("569", "no test") },
        });

        await Act();

        next.Verify(n => n(httpContext));
    }

    [Fact]
    public async Task ShouldRedirect()
    {
        httpContext.Request.Path = "/path";
        suspiciousRequestConfiguration.SetupGet(m => m.QueryStringRules).Returns(new Dictionary<string, StringRule>()
        {
            { "test", new StringRule("569", "no test") },
            { "query", new StringRule("se3", "match") },
        });

        await Act();

        httpContext.Response.VerifyRedirect("/path?dsr=1");
        httpContext.Response.Headers.Should().BeEquivalentTo(new Dictionary<string, StringValues>
        {
            { "X-Vanilla-Suspicious-Request", "match" },
            { "X-Redirect-Source", "Frontend.Host.Features.SuspiciousRequest.SuspiciousRequestMiddleware" },
            { "Location", "/path?dsr=1" },
        });
        next.VerifyNoOtherCalls();
    }
}
