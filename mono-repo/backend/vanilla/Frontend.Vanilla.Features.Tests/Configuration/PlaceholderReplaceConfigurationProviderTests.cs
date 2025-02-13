using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.Configuration;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Configuration;

public class PlaceholderReplaceConfigurationProviderTests
{
    [Fact]
    public void Load_ShouldReplacePlaceholdersWithEnvVariablePriority()
    {
        // Arrange
        var settings = new Dictionary<string, string>
        {
            { "Setting1", "${COMMON_KEY}" },
            { "Setting2", "${PROVIDER_KEY}" },
        };

        var baseConfiguration = new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();

        // Simulate environment variable
        Environment.SetEnvironmentVariable("COMMON_KEY", "EnvironmentVariableValue");

        var provider = new PlaceholderReplaceConfigurationProvider(baseConfiguration, [("COMMON_KEY", "from providers"), ("PROVIDER_KEY", "testvalue")]);

        // Act
        provider.Load();

        // Assert
        provider.TryGet("Setting1", out var value1).Should().BeTrue();
        value1.Should().Be("EnvironmentVariableValue"); // ${COMMON_KEY} replaced from env var

        provider.TryGet("Setting2", out var value2).Should().BeTrue();
        value2.Should().Be("testvalue");

        provider.TryGet("Setting3", out _).Should().BeFalse();
    }

    [Fact]
    public void Load_ShouldThrowWhenPlaceholderReplacementIsMissing()
    {
        // Arrange
        var settings = new Dictionary<string, string>
        {
            { "Setting1", "${MISSING_PLACEHOLDER}" },
        };

        var baseConfiguration = new ConfigurationBuilder()
            .AddInMemoryCollection(settings)
            .Build();

        // Ensure the environment variable is not set
        Environment.SetEnvironmentVariable("MISSING_PLACEHOLDER", null);

        var provider = new PlaceholderReplaceConfigurationProvider(baseConfiguration, [("P1", "V1")]);

        // Act
        var act = () => provider.Load();

        // Assert
        act.Should().Throw<Exception>().Which.Message.Should().Contain("Failed to replace appsettings.json placeholder '${MISSING_PLACEHOLDER}'. Neither environment variable nor placeholder with name 'MISSING_PLACEHOLDER' were found. Existing placeholders are 'P1'.");
    }
}
