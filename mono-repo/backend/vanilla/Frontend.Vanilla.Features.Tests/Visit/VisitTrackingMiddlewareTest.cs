using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Visit;
using Frontend.Vanilla.Features.Visitor;
using Frontend.Vanilla.Features.WebUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Visit;

public sealed class VisitTrackingMiddlewareTest
{
    private readonly Features.WebAbstractions.Middleware target;
    private readonly Mock<RequestDelegate> next;
    private readonly Mock<IEndpointMetadata> endpointMetadata;
    private readonly Mock<IVisitorSettingsManager> visitorSessings;
    private readonly Mock<IClock> clock;
    private readonly Mock<ICookieHandler> cookiehandler;
    private readonly HttpContext ctx;

    public VisitTrackingMiddlewareTest()
    {
        next = new Mock<RequestDelegate>();
        endpointMetadata = new Mock<IEndpointMetadata>();
        visitorSessings = new Mock<IVisitorSettingsManager>();
        clock = new Mock<IClock>();
        cookiehandler = new Mock<ICookieHandler>();

        ctx = new DefaultHttpContext();

        target = new VisitTrackingMiddleware(next.Object, visitorSessings.Object, clock.Object, cookiehandler.Object, endpointMetadata.Object);
    }

    [Fact]
    public async Task ShouldNotExecute_IfNotServesHtmlDocumentAttribute()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>())
            .Returns(false);
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        cookiehandler.Verify(c => c.GetValue("vnSession"), Times.Never());
    }

    [Fact]
    public async Task ShouldExecute_IfServesHtmlDocumentAttribute()
    {
        var visitor = new VisitorSettings(Guid.NewGuid().ToString(), RandomGenerator.GetInt32(), TestTime.GetRandomUtc(), TestTime.GetRandomUtc());
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        visitorSessings.Setup(v => v.Current).Returns(visitor);

        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        cookiehandler.Verify(c => c.Set(It.IsAny<string>(), It.IsAny<string>(), null), Times.Once);
    }

    [Fact]
    public async Task ShouldNotSetCookie_IfAllreadyPreset()
    {
        endpointMetadata.Setup(m => m.Contains<ServesHtmlDocumentAttribute>()).Returns(true);
        cookiehandler.Setup(c => c.GetValue("vnSession")).Returns("72d63337-3717-4c91-8d20-303454214c13");
        await target.InvokeAsync(ctx);

        next.Verify(n => n(ctx));
        cookiehandler.Verify(c => c.Set("vnSession", "", null), Times.Never);
    }
}
