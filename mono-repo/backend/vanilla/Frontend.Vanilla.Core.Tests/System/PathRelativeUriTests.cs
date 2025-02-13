using System;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.System;

public class PathRelativeUriTests
{
    [Theory]
    [InlineData("extensionless", false)]
    [InlineData("extensionless", true)]
    [InlineData("file.txt", false)]
    [InlineData("file.txt", true)]
    [InlineData("path/file.txt", false)]
    [InlineData("path/file.txt", true)]
    public void ShouldCreateCorrectly(
        string uriString,
        bool useRawString)
    {
        // Act
        var target = GetTargetFunc(uriString, useRawString)();

        target.IsAbsoluteUri.Should().BeFalse();
        target.ToString().Should().Be(uriString);
    }

    [Theory]
    [InlineData("", false)]
    [InlineData("", true)]
    [InlineData("  ", false)]
    [InlineData("  ", true)]
    [InlineData("/rooted", false)]
    [InlineData("/rooted", true)]
    [InlineData("\\rooted", false)]
    [InlineData("\\rooted", true)]
    public void ShouldThrow_IfInvalid(
        string uriString,
        bool useRawString)
    {
        var act = GetTargetFunc(uriString, useRawString);

        act.Should().Throw<ArgumentException>()
            .Which.Message.Should().StartWith(PathRelativeUri.InvalidValueMessage)
            .And.Contain(uriString != null ? $"'{uriString}'" : "null");
    }

    [Theory]
    [InlineData(false)]
    [InlineData(true)]
    public void ShouldThrow_IfAbsolute(bool useRawString)
    {
        var act = GetTargetFunc("http://absolute/path", useRawString);
        act.Should().Throw<UriFormatException>();
    }

    private static Func<PathRelativeUri> GetTargetFunc(string uriString, bool useRawString)
    {
        var uri = uriString != null ? new Uri(uriString, UriKind.RelativeOrAbsolute) : null;

        return useRawString
            ? new Func<PathRelativeUri>(() => new PathRelativeUri(uriString))
            : () => new PathRelativeUri(uri);
    }
}
