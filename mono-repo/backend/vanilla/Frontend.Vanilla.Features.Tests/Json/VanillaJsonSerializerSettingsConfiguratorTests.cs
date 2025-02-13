using System;
using FluentAssertions;
using Frontend.Vanilla.Features.Json;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Json;

public class VanillaJsonSerializerSettingsConfiguratorTests
{
    private IJsonSerializerSettingsConfigurator vanillaJsonSerializerSettingsConfigurator;

    public VanillaJsonSerializerSettingsConfiguratorTests()
    {
        vanillaJsonSerializerSettingsConfigurator = new VanillaJsonSerializerSettingsConfigurator(Array.Empty<JsonConverter>());
    }

    [Fact]
    public void ShouldBePossibleToCreateASerializerBasedOnConfiguredSettings()
    {
        var settings = new JsonSerializerSettings();

        vanillaJsonSerializerSettingsConfigurator.Configure(settings);

        var serializer = JsonSerializer.Create(settings);

        serializer.Should().NotBeNull();
    }
}
