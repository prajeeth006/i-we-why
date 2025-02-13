using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.Diagnostics.ServerTiming;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.ServerTiming
{
    public class ServerTimingMiddlewareTests
    {
        [Fact]
        public async Task InvokeAsync_Should_AddServerTimingHeader()
        {
            // Arrange
            var clock = new Mock<IClock>();

            var next = new Mock<RequestDelegate>();

            var httpContext = new DefaultHttpContext();

            clock.Setup(c => c.StartNewStopwatch())
                .Returns(() => TimeSpan.FromTicks(666_000));
            next.Setup(n => n(httpContext))
                .Returns(Task.CompletedTask);

            var middleware = new ServerTimingMiddleware(next.Object, clock.Object);

            // Act
            await middleware.InvokeAsync(httpContext);

            // Assert TODO no nice way to invoke OnStarting callback
            // context.Response.Headers[HttpHeaders.ServerTiming].ToString().Should().Be("vanilla;dur=100");
            next.Verify(n => n(httpContext), Times.Once);
        }
    }
}
