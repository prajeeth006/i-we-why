using FluentAssertions;
using Frontend.Host.Features.StatusCode;
using Frontend.Vanilla.Features.Routing;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.StatusCode;

public sealed class StatusCodeMiddlewareTest
{
    private readonly Middleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<IStatusCodeConfiguration> statusCodeConfiguration;
    private readonly DefaultHttpContext ctx;

    public StatusCodeMiddlewareTest()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        statusCodeConfiguration = new Mock<IStatusCodeConfiguration>();

        ctx = new DefaultHttpContext();

        ctx.Request.RouteValues.Add(RouteValueKeys.Path, "id");

        statusCodeConfiguration.SetupGet(x => x.ResponseStatusCode)
            .Returns(new Dictionary<string, IReadOnlyList<string>>
            {
                { "401", new[] { "/promo/oddboost", "/promo/riskfreebet/*" } },
                { "403", new[] { "/menu", "/abc/*" } },
            });

        target = new StatusCodeMiddleware(next.Object, statusCodeConfiguration.Object, endpointMetadata.Object);
    }

    [Fact]
    public async Task ShouldNotExecute_IfServesNotFoundAttribute()
    {
        endpointMetadata.Setup(m => m.Contains<ServesNotFoundAttribute>()).Returns(true);
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
    }

    [Fact]
    public async Task ShouldNotExecute_IfConfigurationIsEmpty()
    {
        statusCodeConfiguration.SetupGet(x => x.ResponseStatusCode)
            .Returns(new Dictionary<string, IReadOnlyList<string>> { });

        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.VerifyNotChanged();
    }

    [Fact]
    public async Task ShouldReturnAccessDenied_IfPathMatchesForStatusCode_401()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        ctx.Request.Path = "/promo/riskfreebet";
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.StatusCode.Should().Be(401);
    }

    [Fact]
    public async Task ShouldReturnForbidden_IfPathMatchesForStatusCode_403()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        ctx.Request.Path = "/abc";
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        ctx.Response.StatusCode.Should().Be(403);
    }
}
