#nullable enable

using FluentAssertions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebUtilities;

public class PathStringExtensionsTests
{
    [Theory]
    [InlineData(null, true)]
    [InlineData("", true)]
    [InlineData("/", true)]
    [InlineData("/foo", false)]
    public void IsRoot_Test(string? input, bool expected)
        => new PathString(input).IsRoot().Should().Be(expected);

    [Theory]
    [InlineData("/foo/bar", true)]
    [InlineData("/foo/bar/", true)]
    [InlineData("/Foo/BAR", true)]
    [InlineData("/foo/bar/wtf", false)]
    [InlineData("/foo", false)]
    [InlineData("/", false)]
    [InlineData("", false)]
    [InlineData(null, false)]
    public void EqualsIgnoreCase_Test(string? input, bool expected)
        => new PathString(input).EqualsIgnoreCase("/foo/bar").Should().Be(expected);

    [Theory]
    [InlineData("", "/foo/bar")]
    [InlineData("/foo", "/bar")]
    [InlineData("/FOO", "/bar")]
    [InlineData("/foo/bar", "")]
    [InlineData("/wtf", null)]
    public void StartsWithIgnoreCase_Test(string tested, string? expectedRemaining)
    {
        // Act
        var result = new PathString("/foo/bar").StartsWithIgnoreCase(tested, out var remanining);

        result.Should().Be(expectedRemaining != null);
        if (expectedRemaining != null) remanining.Value.Should().Be(expectedRemaining);
    }
}
