using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Configuration;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Configuration;

public class PlaceholderReplaceConfigurationSourceTests
{
    [Fact]
    public void Build_ShouldReturnEnvironmentVariablePlaceholderConfigurationProvider()
    {
        // Arrange
        var mockConfigurationRoot = new Mock<IConfigurationRoot>();
        var mockBuilder = new Mock<IConfigurationBuilder>();

        // Act
        var configSource = new PlaceholderReplaceConfigurationSource(mockConfigurationRoot.Object);
        var provider = configSource.Build(mockBuilder.Object);

        // Assert
        provider.Should().NotBeNull();
        provider.Should().BeOfType<PlaceholderReplaceConfigurationProvider>();
    }
}
