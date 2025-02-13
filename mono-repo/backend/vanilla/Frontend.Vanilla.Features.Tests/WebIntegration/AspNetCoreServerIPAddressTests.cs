#nullable enable
using System;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebIntegration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration;

public class AspNetCoreServerIPAddressTests
{
    private IServerIPProvider target;
    private Mock<IHttpContextAccessor> httpContextAccessor;

    public AspNetCoreServerIPAddressTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        target = new AspNetCoreServerIpAddress(httpContextAccessor.Object);
    }

    [Fact]
    public void ShouldGetFromConnectionFeature()
    {
        var ip = IPAddress.Parse("1.2.3.4");
        httpContextAccessor.SetupGet(a => a.HttpContext!.Features.Get<IHttpConnectionFeature>()!.LocalIpAddress).Returns(ip);

        // Act
        target.IPAddress.Should().BeSameAs(ip);
    }

    [Fact]
    public void ShouldReturnNull_IfNoConnectionFeature()
    {
        httpContextAccessor.Setup(a => a.HttpContext!.Features.Get<IHttpConnectionFeature>()).Returns(() => null!);

        // Act
        target.IPAddress.Should().BeNull();
    }

    [Fact]
    public void ShouldThrow_IfNoHttpContext()
        => new Func<object?>(() => target.IPAddress)
            .Should().Throw<NoHttpContextException>();
}
