using System;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration;

public class AspNetCoreEndpointMetadataTests
{
    private readonly EndpointMetadataBase target;
    private readonly Mock<IHttpContextAccessor> httpContextAccessor;

    public AspNetCoreEndpointMetadataTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        target = new AspNetCoreEndpointMetadata(httpContextAccessor.Object);

        httpContextAccessor.SetupGet(a => a.HttpContext!.Features).Returns(new FeatureCollection());
    }

    [Fact]
    public void ShouldGetFromEndpoint()
    {
        var endpoint = new Endpoint(_ => Task.CompletedTask, new EndpointMetadataCollection("a", 11, "b", "c", new object()), null);
        httpContextAccessor.Object.HttpContext!.SetEndpoint(endpoint);

        // Act
        var result = target.GetOrdered<string>();

        result.Should().Equal("a", "b", "c");
    }

    [Fact]
    public void ShouldThrow_IfNoRouting()
        => RunThrowTest<NoRoutingExecutedException>();

    [Fact]
    public void ShouldThrow_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => null!);
        RunThrowTest<NoHttpContextException>();
    }

    private void RunThrowTest<TException>()
        where TException : Exception
        => new Action(() => target.GetOrdered<string>())
            .Should().Throw<TException>();
}
