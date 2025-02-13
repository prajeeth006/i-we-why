using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class TenantSettingsTests
{
    [Theory]
    [InlineData(null, null, false)]
    [InlineData(null, null, true)]
    [InlineData(null, "Overrides.json", false)]
    [InlineData(null, "Overrides.json", true)]
    [InlineData("Fallback.json", "Overrides.json", false)]
    [InlineData("Fallback.json", "Overrides.json", true)]
    [InlineData("Fallback.json", null, false)]
    [InlineData("Fallback.json", null, true)]
    public void ShouldCreateCorrectly(
        string fallbackFileStr,
        string overridesFileStr,
        bool hasParameters)
    {
        var parameters = hasParameters ? new[] { new DynaConParameter("p", "v") } : Array.Empty<DynaConParameter>();
        var fallbackFile = fallbackFileStr != null ? OperatingSystemRootedPath.Get(fallbackFileStr) : null;
        var overridesFile = overridesFileStr != null ? OperatingSystemRootedPath.Get(fallbackFileStr) : null;

        // Act
        var target = new TenantSettings("bwin.com", fallbackFile, overridesFile, parameters);

        target.Name.Should().Be("bwin.com");
        target.ChangesetFallbackFile.Should().Be(fallbackFile);
        target.LocalOverridesFile.Should().Be(overridesFile);
        target.Parameters.Should().BeEquivalentTo(parameters);
    }
}
