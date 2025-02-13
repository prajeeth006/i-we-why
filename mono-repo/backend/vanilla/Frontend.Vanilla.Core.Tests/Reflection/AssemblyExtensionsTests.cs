using System;
using FluentAssertions;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Reflection;

public class AssemblyExtensionsTests
{
    [Theory]
    [InlineData("6.6.6", "6.6.6")]
    [InlineData(null, "1.2.0")]
    public void GetFileVersion_Test(string fileVersion, string expected)
    {
        var target = TestAssembly.Get(assemblyVersion: "1.2.0", fileVersion: fileVersion);

        target.GetFileVersion().Should().Be(Version.Parse(expected)); // Act
    }

    [Theory]
    [InlineData("6.6.6", "6.6.6")]
    [InlineData("  ", "1.2.0")]
    [InlineData("", "1.2.0")]
    [InlineData(null, "1.2.0")]
    public void GetFullVersion_Test(string infoVersion, string expected)
    {
        var target = TestAssembly.Get(assemblyVersion: "1.2.0", infoVersion: infoVersion);

        target.GetFullVersion().Should().Be(expected); // Act
    }
}
