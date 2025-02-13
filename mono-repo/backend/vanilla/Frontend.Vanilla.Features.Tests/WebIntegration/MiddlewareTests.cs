using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration;

public class MiddlewareTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var next = Mock.Of<RequestDelegate>();

        // Act
        var target = new Mock<Features.WebAbstractions.Middleware>(next);

        target.Object.Next.Should().BeSameAs(next);
    }
}

internal sealed class TestBeforeNextMiddleware : BeforeNextMiddleware
{
    public TestBeforeNextMiddleware(RequestDelegate next)
        : base(next) { }

    public override void BeforeNext(HttpContext httpContext)
    {
        httpContext.Response.Headers.Append("test", "1");
    }
}

public class BeforeNextMiddlewareTests
{
    [Fact]
    public async Task ShouldExecuteMethodBeforeNext()
    {
        var next = new Mock<RequestDelegate>();
        var target = new TestBeforeNextMiddleware(next.Object);
        var httpContext = new DefaultHttpContext();

        // Act
        await target.InvokeAsync(httpContext);

        httpContext.Response.Headers["test"].ToString().Should().Be("1");
        next.Verify(n => n(httpContext), Times.Once);
    }
}
