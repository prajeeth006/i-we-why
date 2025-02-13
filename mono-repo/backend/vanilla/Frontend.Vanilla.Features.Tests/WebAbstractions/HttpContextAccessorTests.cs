using System;
using FluentAssertions;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Testing.FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebAbstractions;

public class HttpContextAccessorTests
{
    private Mock<IHttpContextAccessor> target;

    public HttpContextAccessorTests()
        => target = new Mock<IHttpContextAccessor>();

    [Fact]
    public void ShouldPassHttpContext()
    {
        var httpContext = Mock.Of<HttpContext>();
        target.SetupGet(t => t.HttpContext).Returns(httpContext);

        // Act
        var result = target.Object.GetRequiredHttpContext();

        result.Should().BeSameAs(httpContext);
    }

    [Fact]
    public void ShouldThrow_IfNoHttpContext()
    {
        // Act
        Action act = () => target.Object.GetRequiredHttpContext();

        act.Should().Throw<NoHttpContextException>()
            .Which.Message.Should().ContainAll(typeof(HttpContextAccessorTests), nameof(ShouldThrow_IfNoHttpContext));
    }
}
