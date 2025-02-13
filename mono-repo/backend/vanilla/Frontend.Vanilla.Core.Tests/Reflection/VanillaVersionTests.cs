using System;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public sealed class VanillaVersionTests
{
    [Theory]
    [InlineData("1.2.3.4", "dev", "1.2.3.4-dev", 1)]
    [InlineData("2.2.3.0", "hash", "2.2.3.0-hash", 2)]
    public void Constructor_ShouldWork(string version, string hash, string expectedVersion, int expectedMajor)
    {
        var target = new VanillaVersion(new Version(version), hash);

        target.ToString().Should().Be(expectedVersion);
        target.Hash.Should().Be(hash);
        target.Version.Major.Should().Be(expectedMajor);
    }

    [Fact]
    public void CreateInstance_ShouldWorkForDevMode()
    {
        Environment.SetEnvironmentVariable("VANILLA_DEV_MODE_ENABLED", "true");
        var devVersionPattern = new Regex(@"^\d{1,2}\.\d{1,2}(.0.0-dev)?$");

        VanillaVersion.CreateInstance().ToString().Should().MatchRegex(devVersionPattern);
        Environment.SetEnvironmentVariable("VANILLA_DEV_MODE_ENABLED", null);
    }

    [Fact]
    public void CreateInstance_ShouldReadDefaultVersionFromAssemblyAndAppendDev()
    {
        VanillaVersion.CreateInstance().ToString().Should().Be("1.0.0-dev");
    }
}
