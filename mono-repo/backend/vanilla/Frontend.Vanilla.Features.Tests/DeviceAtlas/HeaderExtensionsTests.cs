#nullable enable
using System;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.DeviceAtlas;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DeviceAtlas;

public class HeadersExtensionsTests
{
    [Fact]
    public void AddIfNoNewlines_ShouldNotAddHeader_WhenValueIsNull()
    {
        // Arrange
        var headers = new HttpRequestMessage().Headers;
        string name = "TestHeader";
        string? value = null;

        // Act
        Action act = () => headers.AddIfNoNewlines(name, value);

        // Assert
        act.Should().NotThrow();
        headers.Contains(name).Should().BeFalse();
    }

    [Fact]
    public void AddIfNoNewlines_ShouldThrowFormatException_WhenValueContainsNewlines()
    {
        // Arrange
        var headers = new HttpRequestMessage().Headers;
        string name = "TestHeader";
        string value = "Invalid\nValue";

        // Act
        Action act = () => headers.AddIfNoNewlines(name, value);

        // Assert
        act.Should().Throw<FormatException>().WithMessage("Failed to forward request headers to device atlas, no newlines validation failed.");
    }

    [Fact]
    public void AddIfNoNewlines_ShouldAddHeader_WhenValueDoesNotContainNewlines()
    {
        // Arrange
        var headers = new HttpRequestMessage().Headers;
        string name = "TestHeader";
        string value = "ValidValue";

        // Act
        Action act = () => headers.AddIfNoNewlines(name, value);

        // Assert
        act.Should().NotThrow();
        headers.TryGetValues(name, out var values).Should().BeTrue();
        values.Should().ContainSingle().Which.Should().Be(value);
    }

    [Fact]
    public void AddIfNoNewlines_ShouldNotThrowException_WhenValueIsValid()
    {
        // Arrange
        var headers = new HttpRequestMessage().Headers;
        string name = "TestHeader";
        string value = "ValidValue";

        // Act
        Action act = () => headers.AddIfNoNewlines(name, value);

        // Assert
        act.Should().NotThrow();
    }
}
