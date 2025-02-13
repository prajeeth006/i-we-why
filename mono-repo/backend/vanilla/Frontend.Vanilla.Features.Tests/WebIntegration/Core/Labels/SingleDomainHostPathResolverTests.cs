using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core.Labels;

public class SingleDomainHostPathResolverTests
{
    private readonly Mock<IHostPathResolver> hostPathResolverMock;
    private readonly Mock<IDefaultProductResolver> defaultProductResolverMock;
    private readonly SingleDomainHostPathResolver target;
    private readonly DefaultHttpContext context;

    public SingleDomainHostPathResolverTests()
    {
        context = new DefaultHttpContext();
        hostPathResolverMock = new Mock<IHostPathResolver>();
        defaultProductResolverMock = new Mock<IDefaultProductResolver>();
        target = new SingleDomainHostPathResolver(hostPathResolverMock.Object, defaultProductResolverMock.Object);
    }

    [Fact]
    public void Resolve_ShouldReturn_WhenHttpContextContainsValidSegments()
    {
        // Arrange
        context.Request.Path = "/en/games";

        // Act
        var result = target.Resolve(context);

        // Assert
        result.Should().Be("Games");
    }

    [Fact]
    public void Resolve_ShouldStillReturnEvenIfParseFails()
    {
        // Arrange
        context.Request.Path = "/en/invalidHostPath";

        // Act
        var result = target.Resolve(context);

        // Assert
        result.Should().Be("invalidHostPath");
    }

    [Fact]
    public void Resolve_ShouldReturnOverridePath_WhenOverrideExists()
    {
        // Arrange
        hostPathResolverMock.Setup(resolver => resolver.GetAllHostPaths())
            .Returns(new Dictionary<string, string> { { "product", "overriddenPath" } });

        // Act
        var result = target.Resolve("product");

        // Assert
        result.Should().Be("overriddenPath");
    }

    [Fact]
    public void Resolve_ShouldThrowWhenNoOverrideExists()
    {
        // Arrange
        hostPathResolverMock.Setup(resolver => resolver.GetAllHostPaths())
            .Returns(new Dictionary<string, string>());

        // Act
        Action act = () => target.Resolve("product");

        // Assert
        act.Should().Throw<FormatException>().WithMessage("Failed to resolve HostPath for 'product'.");
    }
}
